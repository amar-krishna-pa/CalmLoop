import { db } from "@/app/lib/db";
import { user } from "@/app/lib/db/schema";
import { and, eq, or, isNull, sql } from "drizzle-orm";

export async function updateStreak({ userId }: { userId: string }) {
  await db
    .update(user)
    .set({
      currentStreak: sql`CASE
        WHEN last_activity_date = CURRENT_DATE - 1
        THEN current_streak + 1
        ELSE 1
      END`,
      longestStreak: sql`GREATEST(longest_streak, CASE
        WHEN last_activity_date = CURRENT_DATE - 1
        THEN current_streak + 1
        ELSE 1
      END)`,
      lastActivityDate: sql`CURRENT_DATE`,
    })
    .where(
      and(
        eq(user.id, userId),
        or(
          isNull(user.lastActivityDate),
          sql`${user.lastActivityDate} < CURRENT_DATE`
        )
      )
    );
}
