import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";

import { checkSession } from "@/app/lib/auth/check-session";
import { db } from "@/app/lib/db";
import { exposureTasks, fears } from "@/app/lib/db/schema";
import { CreateExposureTaskSchema } from "@/app/lib/zod/create-exposure-task-schema";
import { maybeUpdateStreak } from "@/app/services/streak/maybe-update-streak";

// Next.js requires positional request and context arguments for route handlers.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ fearId: string }> },
) {
  const session = await checkSession();
  if (!session) {
    return Response.json(
      { error: "Please sign in to continue." },
      { status: 401 },
    );
  }

  const { fearId } = await params;
  const parsedId = z.string().uuid().safeParse(fearId);
  if (!parsedId.success) {
    return Response.json(
      { error: "This fear isn’t available." },
      { status: 404 },
    );
  }

  const userId = session.user.id;
  const [fear] = await db
    .select({ id: fears.id })
    .from(fears)
    .where(and(eq(fears.id, parsedId.data), eq(fears.userId, userId)));

  if (!fear) {
    return Response.json(
      { error: "This fear isn’t available." },
      { status: 404 },
    );
  }

  const tasks = await db
    .select()
    .from(exposureTasks)
    .where(
      and(
        eq(exposureTasks.fearId, parsedId.data),
        eq(exposureTasks.userId, userId),
      ),
    )
    .orderBy(desc(exposureTasks.createdAt), desc(exposureTasks.id));

  return Response.json({ tasks });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ fearId: string }> },
) {
  const session = await checkSession();
  if (!session) {
    return Response.json(
      { error: "Please sign in to continue." },
      { status: 401 },
    );
  }

  const { fearId } = await params;
  const parsedId = z.string().uuid().safeParse(fearId);
  if (!parsedId.success) {
    return Response.json(
      { error: "This fear isn’t available." },
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

  const parsed = CreateExposureTaskSchema.safeParse(body);
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
  const [fear] = await db
    .select({ id: fears.id })
    .from(fears)
    .where(and(eq(fears.id, parsedId.data), eq(fears.userId, userId)));

  if (!fear) {
    return Response.json(
      { error: "This fear isn’t available." },
      { status: 404 },
    );
  }

  const [task] = await db
    .insert(exposureTasks)
    .values({
      userId,
      fearId: fear.id,
      action: parsed.data.action,
      compulsionsToAvoid: parsed.data.compulsionsToAvoid,
      expectedSuds: parsed.data.expectedSuds,
    })
    .returning();

  await maybeUpdateStreak({ user: session.user });

  return Response.json({ task }, { status: 201 });
}
