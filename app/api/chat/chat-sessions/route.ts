import { checkSession } from "@/app/lib/auth/check-session";
import { db } from "@/app/lib/db";
import { chatSessions } from "@/app/lib/db/schema";
import { and, desc, eq, inArray } from "drizzle-orm";

export async function GET() {
  const session = await checkSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await db
    .select({
      id: chatSessions.id,
      title: chatSessions.title,
      createdAt: chatSessions.createdAt,
    })
    .from(chatSessions)
    .where(eq(chatSessions.userId, session.user.id))
    .orderBy(desc(chatSessions.createdAt))
    .limit(50);

  return Response.json({ sessions: rows });
}

export async function DELETE(request: Request) {
  const session = await checkSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { ids } = await request.json();
  if (!Array.isArray(ids) || ids.length === 0) {
    return Response.json({ error: "Invalid ids" }, { status: 400 });
  }

  await db
    .delete(chatSessions)
    .where(
      and(
        inArray(chatSessions.id, ids),
        eq(chatSessions.userId, session.user.id)
      )
    );

  return Response.json({ deleted: ids });
}
