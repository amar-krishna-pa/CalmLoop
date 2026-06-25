import { checkSession } from "@/app/lib/auth/check-session";
import { db } from "@/app/lib/db";
import { chatSessions } from "@/app/lib/db/schema";
import { and, eq } from "drizzle-orm";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ chatSessionId: string }> }
) {
  const session = await checkSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { chatSessionId } = await params;
  const { title } = await request.json();

  if (typeof title !== "string" || title.trim().length === 0) {
    return Response.json({ error: "Invalid title" }, { status: 400 });
  }

  const [updated] = await db
    .update(chatSessions)
    .set({ title: title.trim() })
    .where(
      and(
        eq(chatSessions.id, chatSessionId),
        eq(chatSessions.userId, session.user.id)
      )
    )
    .returning({ id: chatSessions.id, title: chatSessions.title });

  if (!updated) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json({ session: updated });
}
