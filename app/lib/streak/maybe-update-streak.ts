import { updateStreak } from "@/app/lib/streak/update-streak";

export async function maybeUpdateStreak({
  user,
}: {
  user: { id: string; lastActivityDate?: string | null };
}) {
  const today = new Date().toISOString().split("T")[0];
  if (user.lastActivityDate !== today) {
    await updateStreak({ userId: user.id });
  }
}
