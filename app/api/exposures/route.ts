import { and, desc, eq, sql } from "drizzle-orm";

import { checkSession } from "@/app/lib/auth/check-session";
import { db } from "@/app/lib/db";
import { erpSessions, fearOccurrences, fears } from "@/app/lib/db/schema";

export async function GET() {
  const session = await checkSession();
  if (!session) {
    return Response.json(
      { error: "Please sign in to continue." },
      { status: 401 },
    );
  }

  const exposures = await db
    .select({
      id: fearOccurrences.id,
      fearId: fears.id,
      fearName: fears.name,
      themes: fears.themes,
      behaviors: fearOccurrences.behaviors,
      evidence: fearOccurrences.evidence,
      initialSuds: fearOccurrences.initialSuds,
      currentSuds: sql<number | null>`(
        SELECT ${erpSessions.suds}
        FROM ${erpSessions}
        WHERE ${erpSessions.fearOccurrenceId} = ${fearOccurrences.id}
          AND ${erpSessions.userId} = ${session.user.id}
        ORDER BY ${erpSessions.completedAt} DESC, ${erpSessions.id} DESC
        LIMIT 1
      )`,
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
