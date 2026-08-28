import { z } from "zod";

import { THEMES } from "@/app/lib/themes/themes";

const Fear = z.object({
  matchedId: z
    .string()
    .nullable()
    .describe(
      "The id of an existing fear from the list you were given, if this entry is about that same fear. Null if none of them fit."
    ),
  proposedName: z
    .string()
    .nullable()
    .describe(
      "A short name for a new fear: three to eight words, starting with an -ing verb, naming a recurring situation the person could face again — 'Shaking hands with people', not 'fear of germs' and not 'Shaking hands with the man who was coughing'. Never name the compulsion: 'Sending an email without rereading it', not 'Rereading emails'. When the fear is an intrusive thought, name the situation the thought arrives in, not the thought. Null when matchedId is set."
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
  behaviours: z
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
      "One item per distinct fear the entry describes. Empty array when the entry contains no OCD content at all."
    ),
});

export type Extraction = z.infer<typeof ExtractionSchema>;
export type ExtractedFear = z.infer<typeof Fear>;
