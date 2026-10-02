import { and, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";

import { checkSession } from "@/app/lib/auth/check-session";
import { db } from "@/app/lib/db";
import { erpSessions, fearOccurrences } from "@/app/lib/db/schema";

// Next.js requires positional request and context arguments for route handlers.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ fearId: string }> },
) {
  const session = await checkSession();
  if (!session) {
    return Response.json({ error: "Please sign in to continue." }, { status: 401 });
  }

  const { fearId } = await params;
  const parsedId = z.string().uuid().safeParse(fearId);
  if (!parsedId.success) {
    return Response.json({ error: "This fear isn’t available." }, { status: 404 });
  }

  const userId = session.user.id;
  const rows = await db
    .select({
      id: fearOccurrences.id,
      evidence: fearOccurrences.evidence,
      behaviors: fearOccurrences.behaviors,
      initialSuds: fearOccurrences.initialSuds,
      currentSuds: sql<number | null>`(
        SELECT ${erpSessions.suds}
        FROM ${erpSessions}
        WHERE ${erpSessions.fearOccurrenceId} = ${fearOccurrences.id}
          AND ${erpSessions.userId} = ${userId}
        ORDER BY ${erpSessions.completedAt} DESC, ${erpSessions.id} DESC
        LIMIT 1
      )`,
      createdAt: fearOccurrences.createdAt,
    })
    .from(fearOccurrences)
    .where(
      and(
        eq(fearOccurrences.fearId, parsedId.data),
        eq(fearOccurrences.userId, userId),
      ),
    )
    .orderBy(desc(fearOccurrences.createdAt), desc(fearOccurrences.id));

  return Response.json({
    occurrences: rows,
  });
}
