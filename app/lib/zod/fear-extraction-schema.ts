import { z } from "zod";

import { THEMES } from "@/app/constants/fears/themes";

const Fear = z.object({
  matchedId: z
    .string()
    .nullable()
    .describe(
      "The id of an existing fear anchor when the underlying feared meaning, rule, or consequence is the same, even if the situation differs. Null if none fit."
    ),
  proposedName: z
    .string()
    .nullable()
    .describe(
      "A short, neutral label for a new fear anchor: the underlying feared meaning, rule, or consequence that can connect situations. Phrase it as the person's concern, not as a fact — 'Concern that negative thoughts can contaminate actions'. Do not name a specific situation, practice task, or compulsion. Null when matchedId is set."
    ),
  evidence: z
    .string()
    .describe(
      "The exact words in the entry that this fear came from. Quote them, do not paraphrase."
    ),
  themes: z
    .array(z.enum(THEMES))
    .describe(
      "What kind of fear this is. Take this from what the person is afraid of, never from the ritual they performed. A fear can have more than one theme. 'Symmetry and ordering' is about how things are arranged; 'Just right' is about the feeling of incompleteness until something is correct."
    ),
  behaviors: z
    .array(z.string())
    .describe(
      "Everything the person did to feel safer, including mental acts, asking someone for reassurance, and avoiding something. Each one a short repeatable action — 'Washing hands', 'Praying for protection', 'Avoiding the restaurant'. Empty array if the entry describes none. Never invent one."
    ),
});

export const ExtractRequestSchema = z.object({
  text: z.string().trim().min(1).max(5000),
});

export const ExtractionSchema = z.object({
  fears: z
    .array(Fear)
    .describe(
      "One item per distinct underlying fear anchor, not per situation or compulsion. Empty array when the entry contains no fear to extract."
    ),
});

export type Extraction = z.infer<typeof ExtractionSchema>;
export type ExtractedFear = z.infer<typeof Fear>;
