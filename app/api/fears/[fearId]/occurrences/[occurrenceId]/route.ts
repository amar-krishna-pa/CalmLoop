import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { checkSession } from "@/app/lib/auth/check-session";
import { db } from "@/app/lib/db";
import { fearOccurrences } from "@/app/lib/db/schema";
import { UpdateOccurrenceSchema } from "@/app/lib/zod/update-occurrence-schema";
import { maybeUpdateStreak } from "@/app/services/streak/maybe-update-streak";

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
    return Response.json({ error: "Please sign in to continue." }, { status: 401 });
  }

  const parsedParams = ParamsSchema.safeParse(await params);
  if (!parsedParams.success) {
    return Response.json({ error: "This entry isn’t available." }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "We couldn’t read this request. You can try again." }, { status: 400 });
  }

  const parsed = UpdateOccurrenceSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "We couldn’t use these details. Please review your entry.", details: parsed.error.flatten() },
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
    return Response.json({ error: "This entry isn’t available." }, { status: 404 });
  }

  await maybeUpdateStreak({ user: session.user });

  return Response.json({ occurrence: updated });
}
