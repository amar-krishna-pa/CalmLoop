import { checkSession } from "@/app/lib/auth/check-session";
import { db } from "@/app/lib/db";
import { triggerLogs } from "@/app/lib/db/schema";
import { CreateTriggerLogSchema } from "@/app/lib/zod/trigger-log";
import { maybeUpdateStreak } from "@/app/utils/maybeUpdateStreak";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  const session = await checkSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const entries = await db
    .select()
    .from(triggerLogs)
    .where(eq(triggerLogs.userId, session.user.id))
    .orderBy(desc(triggerLogs.createdAt));

  return Response.json({ entries });
}

export async function POST(request: Request) {
  const session = await checkSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = CreateTriggerLogSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const { trigger, context, anxietyLevel } = parsed.data;

  const [entry] = await db
    .insert(triggerLogs)
    .values({
      userId: session.user.id,
      trigger,
      context,
      anxietyLevel,
    })
    .returning();

  await maybeUpdateStreak({ user: session.user });

  return Response.json({ entry }, { status: 201 });
}
