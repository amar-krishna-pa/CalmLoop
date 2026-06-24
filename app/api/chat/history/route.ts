import { checkSession } from "@/app/lib/auth/check-session";
import { db } from "@/app/lib/db";
import { journalSessions, messages } from "@/app/lib/db/schema";
import { and, asc, eq } from "drizzle-orm";

export async function GET(request: Request) {
  const session = await checkSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  const { searchParams } = new URL(request.url);
  const journalSessionId = searchParams.get("journalSessionId");
  if (!journalSessionId) {
    return Response.json({ error: "Missing journalSessionId" }, { status: 400 });
  }

  const [journalSession] = await db
    .select({ id: journalSessions.id })
    .from(journalSessions)
    .where(
      and(
        eq(journalSessions.id, journalSessionId),
        eq(journalSessions.userId, userId)
      )
    )
    .limit(1);

  if (!journalSession) {
    return Response.json({ messages: [] });
  }

  const rows = await db
    .select()
    .from(messages)
    .where(eq(messages.sessionId, journalSessionId))
    .orderBy(asc(messages.createdAt));

  const uiMessages = rows.map((m) => ({
    id: m.id,
    role: m.role,
    parts: [{ type: "text", text: m.content }],
  }));

  return Response.json({ messages: uiMessages });
}
