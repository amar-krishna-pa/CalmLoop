import { z } from "zod";

export const ExposureTaskSchema = z.object({
  id: z.string().uuid(),
  fearId: z.string().uuid(),
  action: z.string(),
  compulsionsToAvoid: z.array(z.string()),
  expectedSuds: z.number().int().min(0).max(10),
});

export type ExposureTask = z.infer<typeof ExposureTaskSchema>;
