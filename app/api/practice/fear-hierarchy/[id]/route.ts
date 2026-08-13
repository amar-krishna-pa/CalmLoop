import { checkSession } from "@/app/lib/auth/check-session";
import { db } from "@/app/lib/db";
import { fearHierarchyItems } from "@/app/lib/db/schema";
import { UpdateFearHierarchyItemSchema } from "@/app/lib/zod/fear-hierarchy";
import { maybeUpdateStreak } from "@/app/utils/maybeUpdateStreak";
import { and, eq } from "drizzle-orm";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await checkSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = UpdateFearHierarchyItemSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const [item] = await db
    .update(fearHierarchyItems)
    .set({ currentSuds: parsed.data.currentSuds })
    .where(
      and(
        eq(fearHierarchyItems.id, id),
        eq(fearHierarchyItems.userId, session.user.id)
      )
    )
    .returning();

  if (!item) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  await maybeUpdateStreak({ user: session.user });

  return Response.json({ item });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await checkSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const [item] = await db
    .delete(fearHierarchyItems)
    .where(
      and(
        eq(fearHierarchyItems.id, id),
        eq(fearHierarchyItems.userId, session.user.id)
      )
    )
    .returning({ id: fearHierarchyItems.id });

  if (!item) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  await maybeUpdateStreak({ user: session.user });

  return Response.json({ id: item.id });
}
