import { createGroq } from "@ai-sdk/groq";
import {
  streamText,
  generateText,
  UIMessage,
  convertToModelMessages,
} from "ai";
import { eq } from "drizzle-orm";
import { SYSTEM_PROMPT } from "@/app/utils/prompts";
import { checkSession } from "@/app/lib/auth/check-session";
import { db } from "@/app/lib/db";
import { chatSessions, messages } from "@/app/lib/db/schema";
import { ChatRequestSchema } from "@/app/lib/zod/chat";

const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });

async function generateSessionTitle(firstMessage: string): Promise<string> {
  const { text } = await generateText({
    model: groq("llama-3.1-8b-instant"),
    prompt: `Generate a short title (3-5 words) for a therapy chat session based on this opening message. Return only the title text, nothing else.\n\nMessage: ${firstMessage}`,
    maxOutputTokens: 20,
  });
  return text.trim();
}

export async function POST(request: Request) {
  const session = await checkSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = ChatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const chatMessages = parsed.data.messages as unknown as UIMessage[];
  const { chatSessionId } = parsed.data;

  const latestUserMessage = chatMessages[chatMessages.length - 1];
  const latestUserMessageContent = latestUserMessage.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");

  try {
    const [existing] = await db
      .select({ id: chatSessions.id, userId: chatSessions.userId })
      .from(chatSessions)
      .where(eq(chatSessions.id, chatSessionId))
      .limit(1);

    if (existing) {
      if (existing.userId !== userId) {
        return Response.json({ error: "Forbidden" }, { status: 403 });
      }
    } else {
      const title = await generateSessionTitle(latestUserMessageContent).catch(
        (err) => {
          console.error("Failed to generate session title:", err);
          return undefined;
        }
      );
      await db
        .insert(chatSessions)
        .values({ id: chatSessionId, userId, title });
    }
  } catch (err) {
    console.error("Failed to resolve chat session:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }

  try {
    await db.insert(messages).values({
      sessionId: chatSessionId,
      role: latestUserMessage.role,
      content: latestUserMessageContent,
    });
  } catch (err) {
    console.error("Failed to save user message:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }

  try {
    const result = streamText({
      model: groq("openai/gpt-oss-120b"),
      system: SYSTEM_PROMPT,
      messages: await convertToModelMessages(chatMessages),
      onFinish: async ({ text }) => {
        try {
          await db.insert(messages).values({
            sessionId: chatSessionId,
            role: "assistant",
            content: text,
          });
        } catch (err) {
          console.error("Failed to save assistant message:", err);
        }
      },
    });
    return result.toUIMessageStreamResponse();
  } catch (err) {
    console.error("Groq streaming failed:", err);
    return Response.json(
      { error: "Failed to generate response" },
      { status: 502 }
    );
  }
}
