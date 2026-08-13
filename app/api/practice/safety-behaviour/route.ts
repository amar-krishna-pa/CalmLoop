import { checkSession } from "@/app/lib/auth/check-session";
import { db } from "@/app/lib/db";
import { safetyBehaviours } from "@/app/lib/db/schema";
import { CreateSafetyBehaviourSchema } from "@/app/lib/zod/safety-behaviour";
import { maybeUpdateStreak } from "@/app/utils/maybeUpdateStreak";
import { desc, eq, sql } from "drizzle-orm";

const frequencyRank = sql`case ${safetyBehaviours.frequency}
  when 'Always' then 4
  when 'Often' then 3
  when 'Sometimes' then 2
  when 'Rarely' then 1
  else 0 end`;

export async function GET() {
  const session = await checkSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const entries = await db
    .select()
    .from(safetyBehaviours)
    .where(eq(safetyBehaviours.userId, session.user.id))
    .orderBy(desc(frequencyRank), desc(safetyBehaviours.createdAt));

  return Response.json({ entries });
}

export async function POST(request: Request) {
  const session = await checkSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = CreateSafetyBehaviourSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const { behaviour, category, frequency } = parsed.data;

  const [entry] = await db
    .insert(safetyBehaviours)
    .values({
      userId: session.user.id,
      behaviour,
      category,
      frequency,
    })
    .returning();

  await maybeUpdateStreak({ user: session.user });

  return Response.json({ entry }, { status: 201 });
}
