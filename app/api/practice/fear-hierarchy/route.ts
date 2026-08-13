import { checkSession } from "@/app/lib/auth/check-session";
import { db } from "@/app/lib/db";
import { fearHierarchyItems } from "@/app/lib/db/schema";
import { CreateFearHierarchyItemSchema } from "@/app/lib/zod/fear-hierarchy";
import { maybeUpdateStreak } from "@/app/utils/maybeUpdateStreak";
import { asc, eq } from "drizzle-orm";

export async function GET() {
  const session = await checkSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await db
    .select()
    .from(fearHierarchyItems)
    .where(eq(fearHierarchyItems.userId, session.user.id))
    .orderBy(asc(fearHierarchyItems.initialSuds));

  return Response.json({ items });
}

export async function POST(request: Request) {
  const session = await checkSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = CreateFearHierarchyItemSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const { situation, initialSuds } = parsed.data;

  const [item] = await db
    .insert(fearHierarchyItems)
    .values({
      userId: session.user.id,
      situation,
      initialSuds,
      currentSuds: initialSuds,
    })
    .returning();

  await maybeUpdateStreak({ user: session.user });

  return Response.json({ item }, { status: 201 });
}
