import { z } from "zod";

export const CreateErpSessionSchema = z.object({
  trigger: z.string().min(1).max(300),
  anxietyBefore: z.number().int().min(0).max(10),
  anxietyAfter: z.number().int().min(0).max(10),
  notes: z.string().max(500).optional(),
});
