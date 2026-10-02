import { z } from "zod";

import { THEMES } from "@/app/constants/fears/themes";

const Occurrence = z.object({
  evidence: z
    .string()
    .describe(
      "The exact words in the entry that this occurrence came from. Quote them, do not paraphrase."
    ),
  behaviors: z
    .array(z.string())
    .describe(
      "Safety behaviors described for this occurrence only, including mental acts, asking someone for reassurance, and avoidance. Each one a short repeatable action. Empty array if this occurrence describes none. Never invent one."
    ),
});

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
  themes: z
    .array(z.enum(THEMES))
    .describe(
      "What kind of fear this is. Take this from what the person is afraid of, never from the ritual they performed. A fear can have more than one theme. 'Symmetry and ordering' is about how things are arranged; 'Just right' is about the feeling of incompleteness until something is correct."
    ),
  occurrence: Occurrence.describe(
    "The specific situation from this entry connected to the fear anchor, with only the evidence and safety behaviors for that situation."
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
