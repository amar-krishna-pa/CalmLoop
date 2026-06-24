import { checkSession } from "@/app/lib/auth/check-session";
import { db } from "@/app/lib/db";
import { chatSessions, messages } from "@/app/lib/db/schema";
import { and, asc, eq } from "drizzle-orm";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ chatSessionId: string }> }
) {
  const session = await checkSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  const { chatSessionId } = await params;

  const [chatSession] = await db
    .select({ id: chatSessions.id })
    .from(chatSessions)
    .where(
      and(
        eq(chatSessions.id, chatSessionId),
        eq(chatSessions.userId, userId)
      )
    )
    .limit(1);

  if (!chatSession) {
    return Response.json({ messages: [] });
  }

  const rows = await db
    .select()
    .from(messages)
    .where(eq(messages.sessionId, chatSessionId))
    .orderBy(asc(messages.createdAt));

  const uiMessages = rows.map((m) => ({
    id: m.id,
    role: m.role,
    parts: [{ type: "text", text: m.content }],
  }));

  return Response.json({ messages: uiMessages });
}
