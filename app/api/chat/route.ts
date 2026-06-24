import { createGroq } from "@ai-sdk/groq";
import { streamText, UIMessage, convertToModelMessages } from "ai";

import { eq } from "drizzle-orm";
import { SYSTEM_PROMPT } from "@/app/utils/prompts";
import { checkSession } from "@/app/lib/auth/check-session";
import { db } from "@/app/lib/db";
import { journalSessions, messages } from "@/app/lib/db/schema";
import { ChatRequestSchema } from "@/app/lib/zod/chat";

const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });

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
  const { journalSessionId } = parsed.data;

  try {
    const [existing] = await db
      .select({ id: journalSessions.id, userId: journalSessions.userId })
      .from(journalSessions)
      .where(eq(journalSessions.id, journalSessionId))
      .limit(1);

    if (existing) {
      if (existing.userId !== userId) {
        return Response.json({ error: "Forbidden" }, { status: 403 });
      }
    } else {
      await db.insert(journalSessions).values({ id: journalSessionId, userId });
    }
  } catch (err) {
    console.error("Failed to resolve journal session:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }

  const latestUserMessage = chatMessages[chatMessages.length - 1];
  const latestUserMessageContent = latestUserMessage.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");
  try {
    await db.insert(messages).values({
      sessionId: journalSessionId,
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
            sessionId: journalSessionId,
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
