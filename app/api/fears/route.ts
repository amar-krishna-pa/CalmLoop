import { and, asc, eq } from "drizzle-orm";

import { checkSession } from "@/app/lib/auth/check-session";
import { db } from "@/app/lib/db";
import { fearOccurrences, fears } from "@/app/lib/db/schema";
import { SaveFearsSchema } from "@/app/lib/fears/save-schema";
import { maybeUpdateStreak } from "@/app/lib/streak/maybe-update-streak";

function mergeBehaviours({
  existing,
  incoming,
}: {
  existing: string[];
  incoming: string[];
}): string[] {
  const seen = new Set(existing.map((behaviour) => behaviour.toLowerCase()));
  const additions = incoming.filter(
    (behaviour) => !seen.has(behaviour.toLowerCase())
  );
  return [...existing, ...additions];
}

export async function GET() {
  const session = await checkSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const savedFears = await db
    .select({ id: fears.id, name: fears.name })
    .from(fears)
    .where(eq(fears.userId, session.user.id))
    .orderBy(asc(fears.name), asc(fears.id));

  return Response.json({ fears: savedFears });
}

export async function POST(request: Request) {
  const session = await checkSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = SaveFearsSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const saved: { fearId: string; name: string }[] = [];

  for (const fear of parsed.data.fears) {
    if (fear.fearId) {
      const [existing] = await db
        .select({ behaviours: fears.behaviours })
        .from(fears)
        .where(and(eq(fears.id, fear.fearId), eq(fears.userId, userId)));

      // Ownership is proved by the update itself — a fear belonging to someone else matches no
      // row and returns nothing, which is reported the same way as a fear that does not exist.
      const [updated] = await db
        .update(fears)
        .set({
          behaviours: mergeBehaviours({
            existing: existing?.behaviours ?? [],
            incoming: fear.behaviours,
          }),
        })
        .where(and(eq(fears.id, fear.fearId), eq(fears.userId, userId)))
        .returning({ id: fears.id, name: fears.name });

      if (!updated) {
        return Response.json({ error: "Fear not found" }, { status: 404 });
      }

      await db.insert(fearOccurrences).values({
        userId,
        fearId: updated.id,
        evidence: fear.evidence,
        initialSuds: fear.initialSuds,
      });

      saved.push({ fearId: updated.id, name: updated.name });
      continue;
    }

    const [created] = await db
      .insert(fears)
      .values({
        userId,
        name: fear.name,
        themes: fear.themes,
        behaviours: fear.behaviours,
      })
      .returning({ id: fears.id, name: fears.name });

    await db.insert(fearOccurrences).values({
      userId,
      fearId: created.id,
      evidence: fear.evidence,
      initialSuds: fear.initialSuds,
    });

    saved.push({ fearId: created.id, name: created.name });
  }

  await maybeUpdateStreak({ user: session.user });

  return Response.json({ fears: saved }, { status: 201 });
}
