import { and, asc, eq } from "drizzle-orm";

import { checkSession } from "@/app/lib/auth/check-session";
import { db } from "@/app/lib/db";
import { fearOccurrences, fears } from "@/app/lib/db/schema";
import { SaveFearsSchema } from "@/app/lib/zod/save-fears-schema";
import { maybeUpdateStreak } from "@/app/services/streak/maybe-update-streak";

export async function GET() {
  const session = await checkSession();
  if (!session) {
    return Response.json({ error: "Please sign in to continue." }, { status: 401 });
  }

  const savedFears = await db
    .select({
      id: fears.id,
      name: fears.name,
      themes: fears.themes,
    })
    .from(fears)
    .where(eq(fears.userId, session.user.id))
    .orderBy(asc(fears.name), asc(fears.id));

  return Response.json({ fears: savedFears });
}

export async function POST(request: Request) {
  const session = await checkSession();
  if (!session) {
    return Response.json({ error: "Please sign in to continue." }, { status: 401 });
  }

  const userId = session.user.id;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "We couldn’t read this request. You can try again." }, { status: 400 });
  }

  const parsed = SaveFearsSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "We couldn’t use these details. Please review your entry.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const saved: { fearId: string; name: string }[] = [];

  for (const fear of parsed.data.fears) {
    if (fear.fearId) {
      const [matchedFear] = await db
        .select({ id: fears.id, name: fears.name })
        .from(fears)
        .where(and(eq(fears.id, fear.fearId), eq(fears.userId, userId)));

      if (!matchedFear) {
        return Response.json({ error: "This fear isn’t available." }, { status: 404 });
      }

      await db.insert(fearOccurrences).values({
        userId,
        fearId: matchedFear.id,
        evidence: fear.occurrence.evidence,
        behaviors: fear.occurrence.behaviors,
        initialSuds: fear.occurrence.initialSuds,
      });

      saved.push({ fearId: matchedFear.id, name: matchedFear.name });
      continue;
    }

    const [created] = await db
      .insert(fears)
      .values({
        userId,
        name: fear.name,
        themes: fear.themes,
      })
      .returning({ id: fears.id, name: fears.name });

    await db.insert(fearOccurrences).values({
      userId,
      fearId: created.id,
      evidence: fear.occurrence.evidence,
      behaviors: fear.occurrence.behaviors,
      initialSuds: fear.occurrence.initialSuds,
    });

    saved.push({ fearId: created.id, name: created.name });
  }

  await maybeUpdateStreak({ user: session.user });

  return Response.json({ fears: saved }, { status: 201 });
}
