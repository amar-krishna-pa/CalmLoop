import { and, asc, eq } from "drizzle-orm";
import { z } from "zod";

import { checkSession } from "@/app/lib/auth/check-session";
import { db } from "@/app/lib/db";
import { erpSessions, exposureTasks } from "@/app/lib/db/schema";
import { CreatePracticeAttemptSchema } from "@/app/lib/zod/create-practice-attempt-schema";
import { maybeUpdateStreak } from "@/app/services/streak/maybe-update-streak";

const attemptFields = {
  id: erpSessions.id,
  exposureTaskId: erpSessions.exposureTaskId,
  suds: erpSessions.suds,
  completedAt: erpSessions.completedAt,
};

// Next.js requires positional request and context arguments for route handlers.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ exposureTaskId: string }> },
) {
  const session = await checkSession();
  if (!session) {
    return Response.json(
      { error: "Please sign in to continue." },
      { status: 401 },
    );
  }

  const { exposureTaskId } = await params;
  const parsedId = z.string().uuid().safeParse(exposureTaskId);
  if (!parsedId.success) {
    return Response.json(
      { error: "This task isn’t available." },
      { status: 404 },
    );
  }

  const userId = session.user.id;
  const [task] = await db
    .select({ id: exposureTasks.id })
    .from(exposureTasks)
    .where(
      and(
        eq(exposureTasks.id, parsedId.data),
        eq(exposureTasks.userId, userId),
      ),
    );

  if (!task) {
    return Response.json(
      { error: "This task isn’t available." },
      { status: 404 },
    );
  }

  const attempts = await db
    .select(attemptFields)
    .from(erpSessions)
    .where(
      and(
        eq(erpSessions.exposureTaskId, parsedId.data),
        eq(erpSessions.userId, userId),
      ),
    )
    .orderBy(asc(erpSessions.completedAt), asc(erpSessions.id));

  return Response.json({ attempts });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ exposureTaskId: string }> },
) {
  const session = await checkSession();
  if (!session) {
    return Response.json(
      { error: "Please sign in to continue." },
      { status: 401 },
    );
  }

  const { exposureTaskId } = await params;
  const parsedId = z.string().uuid().safeParse(exposureTaskId);
  if (!parsedId.success) {
    return Response.json(
      { error: "This task isn’t available." },
      { status: 404 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "We couldn’t read this request. You can try again." },
      { status: 400 },
    );
  }

  const parsed = CreatePracticeAttemptSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      {
        error: "We couldn’t use these details. Please review your entry.",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const userId = session.user.id;
  const [task] = await db
    .select({ id: exposureTasks.id })
    .from(exposureTasks)
    .where(
      and(
        eq(exposureTasks.id, parsedId.data),
        eq(exposureTasks.userId, userId),
      ),
    );

  if (!task) {
    return Response.json(
      { error: "This task isn’t available." },
      { status: 404 },
    );
  }

  const [attempt] = await db
    .insert(erpSessions)
    .values({
      userId,
      exposureTaskId: task.id,
      suds: parsed.data.suds,
    })
    .returning(attemptFields);

  await maybeUpdateStreak({ user: session.user });

  return Response.json({ attempt }, { status: 201 });
}
