import { createGroq } from "@ai-sdk/groq";
import { generateObject } from "ai";
import { eq } from "drizzle-orm";

import { checkSession } from "@/app/lib/auth/check-session";
import { db } from "@/app/lib/db";
import { fears } from "@/app/lib/db/schema";
import type { ExtractedFearPreview } from "@/app/lib/types/extraction";
import { ExtractRequestSchema, ExtractionSchema } from "@/app/lib/zod/extraction";
import { EXTRACTION_PROMPT } from "@/app/utils/prompts";

const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });

type CatalogFear = { id: string; name: string; themes: string[] };

function renderCatalog({ catalog }: { catalog: CatalogFear[] }): string {
  if (catalog.length === 0) return "## Existing fears\n(none yet)";
  const lines = catalog.map(
    (fear) => `${fear.id}: ${fear.name} [${fear.themes.join(", ")}]`
  );
  return `## Existing fears\n${lines.join("\n")}`;
}

export async function POST(request: Request) {
  const session = await checkSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = ExtractRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const catalog = await db
    .select({ id: fears.id, name: fears.name, themes: fears.themes })
    .from(fears)
    .where(eq(fears.userId, session.user.id));

  let extraction;
  try {
    const { object } = await generateObject({
      model: groq("openai/gpt-oss-120b"),
      schema: ExtractionSchema,
      system: EXTRACTION_PROMPT,
      prompt: `${renderCatalog({ catalog })}\n\n## Entry\n${parsed.data.text}`,
    });
    extraction = object;
  } catch {
    return Response.json({ error: "Extraction failed" }, { status: 502 });
  }

  const byId = new Map(catalog.map((fear) => [fear.id, fear]));

  // The model returns matchedId as a free string, so it can name a fear that does not exist —
  // or belongs to someone else. Resolve against this user's catalog only; anything else is
  // treated as a new fear rather than trusted.
  const preview = extraction.fears.map((fear) => {
    const matched = fear.matchedId ? byId.get(fear.matchedId) : undefined;

    // fearId null means this is a new fear the person has not recorded before.
    return {
      fearId: matched ? matched.id : null,
      name: matched ? matched.name : fear.proposedName,
      themes: fear.themes,
      evidence: fear.evidence,
      behaviours: fear.behaviours,
    };
  });

  // A new fear with no name is unusable in the preview — there is nothing to show or save. The
  // predicate keeps the response matching the type the client reads it back as.
  const usable = preview.filter(
    (fear): fear is ExtractedFearPreview => fear.name !== null
  );

  return Response.json({ fears: usable });
}
