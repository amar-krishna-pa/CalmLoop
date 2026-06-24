import { checkSession } from "@/app/lib/auth/check-session";
import { db } from "@/app/lib/db";
import { journalSessions } from "@/app/lib/db/schema";
import { desc, eq, sql } from "drizzle-orm";

export async function GET() {
  const session = await checkSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await db
    .select({
      id: journalSessions.id,
      createdAt: journalSessions.createdAt,
    })
    .from(journalSessions)
    .where(eq(journalSessions.userId, session.user.id))
    .orderBy(desc(journalSessions.createdAt))
    .limit(50);

  return Response.json({ sessions: rows });
}
