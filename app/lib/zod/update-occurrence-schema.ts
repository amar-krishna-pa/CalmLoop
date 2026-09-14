import { z } from "zod";

export const UpdateOccurrenceSchema = z.strictObject({
  evidence: z.string().trim().min(1).max(2000),
  initialSuds: z.number().int().min(0).max(10),
});
