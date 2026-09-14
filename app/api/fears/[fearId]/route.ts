import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { checkSession } from "@/app/lib/auth/check-session";
import { db } from "@/app/lib/db";
import { fears } from "@/app/lib/db/schema";
import { UpdateFearSchema } from "@/app/lib/fears/update-schema";
import { maybeUpdateStreak } from "@/app/lib/streak/maybe-update-streak";

// Next.js requires positional request and context arguments for route handlers.
export async function PATCH(
  request: Request,
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

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = UpdateFearSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const [updated] = await db
    .update(fears)
    .set({ name: parsed.data.name, themes: parsed.data.themes })
    .where(
      and(eq(fears.id, parsedId.data), eq(fears.userId, session.user.id)),
    )
    .returning({
      id: fears.id,
      name: fears.name,
      themes: fears.themes,
      behaviours: fears.behaviours,
    });

  if (!updated) {
    return Response.json({ error: "Fear not found" }, { status: 404 });
  }

  await maybeUpdateStreak({ user: session.user });

  return Response.json({ fear: updated });
}
