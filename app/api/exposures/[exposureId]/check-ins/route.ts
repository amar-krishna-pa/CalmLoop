import { sql } from "drizzle-orm";
import { z } from "zod";

import { checkSession } from "@/app/lib/auth/check-session";
import { db } from "@/app/lib/db";
import { erpSessions, fearOccurrences } from "@/app/lib/db/schema";
import { CreateExposureCheckInSchema } from "@/app/lib/zod/exposure-check-in-schema";
import { maybeUpdateStreak } from "@/app/services/streak/maybe-update-streak";

type CheckInResultRow = {
  checkInId: string;
  exposureId: string;
  suds: number;
  notes: string | null;
  completedAt: Date;
  currentSuds: number;
};

export async function POST(
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

  const parsedId = z.string().uuid().safeParse((await params).exposureId);
  if (!parsedId.success) {
    return Response.json(
      { error: "This practice situation isn’t available for a check-in." },
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

  const parsed = CreateExposureCheckInSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      {
        error: "Enter a distress rating from 0 to 10.",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const exposureId = parsedId.data;
  const userId = session.user.id;
  const { suds } = parsed.data;
  const notes = parsed.data.notes || null;

  const result = await db.execute<CheckInResultRow>(sql`
    WITH eligible_exposure AS (
      SELECT ${fearOccurrences.id} AS exposure_id
      FROM ${fearOccurrences}
      WHERE ${fearOccurrences.id} = ${exposureId}
        AND ${fearOccurrences.userId} = ${userId}
        AND ${fearOccurrences.practiceStatus} = ${"in_progress"}
      FOR UPDATE
    ),
    created_check_in AS (
      INSERT INTO ${erpSessions} (user_id, fear_occurrence_id, suds, notes)
      SELECT ${userId}, exposure_id, ${suds}, ${notes}
      FROM eligible_exposure
      RETURNING id, fear_occurrence_id, suds, notes, completed_at
    ),
    updated_exposure AS (
      UPDATE ${fearOccurrences}
      SET current_suds = ${suds}, updated_at = NOW()
      WHERE ${fearOccurrences.id} IN (
        SELECT fear_occurrence_id FROM created_check_in
      )
      RETURNING ${fearOccurrences.id} AS exposure_id,
        ${fearOccurrences.currentSuds} AS current_suds
    )
    SELECT created_check_in.id AS "checkInId",
      created_check_in.fear_occurrence_id AS "exposureId",
      created_check_in.suds,
      created_check_in.notes,
      created_check_in.completed_at AS "completedAt",
      updated_exposure.current_suds AS "currentSuds"
    FROM created_check_in
    INNER JOIN updated_exposure
      ON updated_exposure.exposure_id = created_check_in.fear_occurrence_id
  `);

  const checkInResult = result.rows[0];

  if (!checkInResult) {
    return Response.json(
      { error: "This practice situation isn’t available for a check-in." },
      { status: 404 },
    );
  }

  await maybeUpdateStreak({ user: session.user });

  return Response.json(
    {
      checkIn: {
        id: checkInResult.checkInId,
        exposureId: checkInResult.exposureId,
        suds: checkInResult.suds,
        notes: checkInResult.notes,
        completedAt: checkInResult.completedAt,
      },
      exposure: {
        id: checkInResult.exposureId,
        currentSuds: checkInResult.currentSuds,
      },
    },
    { status: 201 },
  );
}
