import { createGroq } from "@ai-sdk/groq";
import { streamText, UIMessage, convertToModelMessages } from "ai";

import { eq, and } from "drizzle-orm";
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
  const incomingSessionId = parsed.data.sessionId;

  let sessionId = incomingSessionId;
  try {
    if (sessionId) {
      const [existing] = await db
        .select({ id: journalSessions.id })
        .from(journalSessions)
        .where(
          and(
            eq(journalSessions.id, sessionId),
            eq(journalSessions.userId, userId)
          )
        )
        .limit(1);

      if (!existing) {
        return Response.json({ error: "Session not found" }, { status: 404 });
      }
    } else {
      const [created] = await db
        .insert(journalSessions)
        .values({ userId })
        .returning({ id: journalSessions.id });
      sessionId = created.id;
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
      sessionId,
      role: latestUserMessage.role,
      content: latestUserMessageContent,
    });
  } catch (err) {
    console.error("Failed to save user message:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }

  try {
    const result = streamText({
      model: groq("llama-3.3-70b-versatile"),
      system: SYSTEM_PROMPT,
      messages: await convertToModelMessages(chatMessages),
      onFinish: async ({ text }) => {
        try {
          await db
            .insert(messages)
            .values({ sessionId, role: "assistant", content: text });
        } catch (err) {
          console.error("Failed to save assistant message:", err);
        }
      },
    });

    return result.toUIMessageStreamResponse({
      headers: { "X-Session-Id": sessionId },
    });
  } catch (err) {
    console.error("Groq streaming failed:", err);
    return Response.json(
      { error: "Failed to generate response" },
      { status: 502 }
    );
  }
}
