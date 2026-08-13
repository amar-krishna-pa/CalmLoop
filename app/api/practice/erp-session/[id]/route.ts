import { checkSession } from "@/app/lib/auth/check-session";
import { db } from "@/app/lib/db";
import { erpSessions } from "@/app/lib/db/schema";
import { maybeUpdateStreak } from "@/app/utils/maybeUpdateStreak";
import { and, eq } from "drizzle-orm";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await checkSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const [erpSession] = await db
    .delete(erpSessions)
    .where(
      and(eq(erpSessions.id, id), eq(erpSessions.userId, session.user.id))
    )
    .returning({ id: erpSessions.id });

  if (!erpSession) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  await maybeUpdateStreak({ user: session.user });

  return Response.json({ id: erpSession.id });
}
