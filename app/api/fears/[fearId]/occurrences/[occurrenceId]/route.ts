import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { checkSession } from "@/app/lib/auth/check-session";
import { db } from "@/app/lib/db";
import { fearOccurrences } from "@/app/lib/db/schema";
import { UpdateOccurrenceSchema } from "@/app/lib/fears/update-occurrence-schema";
import { maybeUpdateStreak } from "@/app/lib/streak/maybe-update-streak";

const ParamsSchema = z.object({
  fearId: z.string().uuid(),
  occurrenceId: z.string().uuid(),
});

// Next.js requires positional request and context arguments for route handlers.
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ fearId: string; occurrenceId: string }> },
) {
  const session = await checkSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsedParams = ParamsSchema.safeParse(await params);
  if (!parsedParams.success) {
    return Response.json({ error: "Occurrence not found" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = UpdateOccurrenceSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { fearId, occurrenceId } = parsedParams.data;
  const [updated] = await db
    .update(fearOccurrences)
    .set({
      evidence: parsed.data.evidence,
      initialSuds: parsed.data.initialSuds,
    })
    .where(
      and(
        eq(fearOccurrences.id, occurrenceId),
        eq(fearOccurrences.fearId, fearId),
        eq(fearOccurrences.userId, session.user.id),
      ),
    )
    .returning({
      id: fearOccurrences.id,
      evidence: fearOccurrences.evidence,
      initialSuds: fearOccurrences.initialSuds,
      currentSuds: fearOccurrences.currentSuds,
      createdAt: fearOccurrences.createdAt,
    });

  if (!updated) {
    return Response.json({ error: "Occurrence not found" }, { status: 404 });
  }

  await maybeUpdateStreak({ user: session.user });

  return Response.json({ occurrence: updated });
}
