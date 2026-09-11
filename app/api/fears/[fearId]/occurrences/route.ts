import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";

import { checkSession } from "@/app/lib/auth/check-session";
import { db } from "@/app/lib/db";
import { fearOccurrences } from "@/app/lib/db/schema";

// Next.js requires positional request and context arguments for route handlers.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ fearId: string }> },
) {
  const session = await checkSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { fearId } = await params;
  const parsedId = z.string().uuid().safeParse(fearId);
  if (!parsedId.success) {
    return Response.json({ error: "Fear not found" }, { status: 404 });
  }

  const userId = session.user.id;
  const rows = await db
    .select({
      id: fearOccurrences.id,
      evidence: fearOccurrences.evidence,
      initialSuds: fearOccurrences.initialSuds,
      currentSuds: fearOccurrences.currentSuds,
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
