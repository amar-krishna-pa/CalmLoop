import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { checkSession } from "@/app/lib/auth/check-session";
import { db } from "@/app/lib/db";
import { fearOccurrences } from "@/app/lib/db/schema";
import { UpdateExposurePracticeStatusSchema } from "@/app/lib/zod/update-exposure-practice-status-schema";
import { maybeUpdateStreak } from "@/app/services/streak/maybe-update-streak";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ exposureId: string }> },
) {
  const session = await checkSession();
  if (!session) {
    return Response.json(
      { error: "Please sign in to continue." },
      { status: 401 },
    );
  }

  const parsedId = z
    .string()
    .uuid()
    .safeParse((await params).exposureId);
  if (!parsedId.success) {
    return Response.json(
      { error: "This practice situation isn’t available." },
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

  const parsed = UpdateExposurePracticeStatusSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      {
        error: "Choose a valid practice status.",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const [updated] = await db
    .update(fearOccurrences)
    .set({ practiceStatus: parsed.data.practiceStatus })
    .where(
      and(
        eq(fearOccurrences.id, parsedId.data),
        eq(fearOccurrences.userId, session.user.id),
      ),
    )
    .returning({
      id: fearOccurrences.id,
      practiceStatus: fearOccurrences.practiceStatus,
    });

  if (!updated) {
    return Response.json(
      { error: "This practice situation isn’t available." },
      { status: 404 },
    );
  }

  await maybeUpdateStreak({ user: session.user });

  return Response.json({ exposure: updated });
}
