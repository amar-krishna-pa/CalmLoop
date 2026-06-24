import { checkSession } from "@/app/lib/auth/check-session";
import { db } from "@/app/lib/db";
import { chatSessions } from "@/app/lib/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  const session = await checkSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await db
    .select({
      id: chatSessions.id,
      createdAt: chatSessions.createdAt,
    })
    .from(chatSessions)
    .where(eq(chatSessions.userId, session.user.id))
    .orderBy(desc(chatSessions.createdAt))
    .limit(50);

  return Response.json({ sessions: rows });
}
