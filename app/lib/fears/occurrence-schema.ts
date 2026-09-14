import { z } from "zod";

export const OccurrenceSchema = z.object({
  id: z.string().uuid(),
  evidence: z.string(),
  initialSuds: z.number().int().min(0).max(10),
  currentSuds: z.number().int().min(0).max(10).nullable(),
  createdAt: z.iso.datetime(),
});

export type Occurrence = z.infer<typeof OccurrenceSchema>;
