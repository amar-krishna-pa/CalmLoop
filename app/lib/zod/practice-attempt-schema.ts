import { z } from "zod";

export const PracticeAttemptSchema = z.object({
  id: z.string().uuid(),
  exposureTaskId: z.string().uuid(),
  suds: z.number().int().min(0).max(10),
  completedAt: z.iso.datetime(),
});

export type PracticeAttempt = z.infer<typeof PracticeAttemptSchema>;
