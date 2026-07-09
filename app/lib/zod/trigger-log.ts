import { z } from "zod";

export const CreateTriggerLogSchema = z.object({
  trigger: z.string().min(1).max(300),
  context: z.string().min(1).max(300),
  anxietyLevel: z.number().int().min(0).max(10),
});
