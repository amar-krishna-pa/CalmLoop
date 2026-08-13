import { checkSession } from "@/app/lib/auth/check-session";
import { db } from "@/app/lib/db";
import { erpSessions } from "@/app/lib/db/schema";
import { CreateErpSessionSchema } from "@/app/lib/zod/erp-session";
import { maybeUpdateStreak } from "@/app/utils/maybeUpdateStreak";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  const session = await checkSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sessions = await db
    .select()
    .from(erpSessions)
    .where(eq(erpSessions.userId, session.user.id))
    .orderBy(desc(erpSessions.createdAt));

  return Response.json({ sessions });
}

export async function POST(request: Request) {
  const session = await checkSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = CreateErpSessionSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const { trigger, anxietyBefore, anxietyAfter, notes } = parsed.data;

  const [erpSession] = await db
    .insert(erpSessions)
    .values({
      userId: session.user.id,
      trigger,
      anxietyBefore,
      anxietyAfter,
      notes: notes ?? null,
    })
    .returning();

  await maybeUpdateStreak({ user: session.user });

  return Response.json({ session: erpSession }, { status: 201 });
}
