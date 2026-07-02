import { checkSession } from "@/app/lib/auth/check-session";
import { db } from "@/app/lib/db";
import { user } from "@/app/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const session = await checkSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [row] = await db
    .select({ currentStreak: user.currentStreak })
    .from(user)
    .where(eq(user.id, session.user.id));

  return Response.json({ currentStreak: row?.currentStreak ?? 1 });
}
