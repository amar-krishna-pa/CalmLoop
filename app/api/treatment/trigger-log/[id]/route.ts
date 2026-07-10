import { checkSession } from "@/app/lib/auth/check-session";
import { db } from "@/app/lib/db";
import { triggerLogs } from "@/app/lib/db/schema";
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

  const [entry] = await db
    .delete(triggerLogs)
    .where(
      and(eq(triggerLogs.id, id), eq(triggerLogs.userId, session.user.id))
    )
    .returning({ id: triggerLogs.id });

  if (!entry) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  await maybeUpdateStreak({ user: session.user });

  return Response.json({ id: entry.id });
}
