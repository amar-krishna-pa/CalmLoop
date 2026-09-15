import { and, desc, eq } from "drizzle-orm";

import { checkSession } from "@/app/lib/auth/check-session";
import { db } from "@/app/lib/db";
import { fearOccurrences, fears } from "@/app/lib/db/schema";

export async function GET() {
  const session = await checkSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const exposures = await db
    .select({
      id: fearOccurrences.id,
      fearId: fears.id,
      fearName: fears.name,
      themes: fears.themes,
      behaviours: fears.behaviours,
      evidence: fearOccurrences.evidence,
      initialSuds: fearOccurrences.initialSuds,
      currentSuds: fearOccurrences.currentSuds,
      createdAt: fearOccurrences.createdAt,
    })
    .from(fearOccurrences)
    .innerJoin(
      fears,
      and(
        eq(fears.id, fearOccurrences.fearId),
        eq(fears.userId, session.user.id),
      ),
    )
    .where(eq(fearOccurrences.userId, session.user.id))
    .orderBy(desc(fearOccurrences.createdAt), desc(fearOccurrences.id));

  return Response.json({ exposures });
}
