import { z } from "zod";

import { THEMES } from "@/app/lib/themes/themes";

const FearToSave = z.object({
  fearId: z.string().uuid().nullable(),
  name: z.string().trim().min(1).max(120),
  themes: z.array(z.enum(THEMES)),
  behaviours: z.array(z.string().trim().min(1).max(120)),
  evidence: z.string().trim().min(1).max(2000),
  initialSuds: z.number().int().min(0).max(10),
});

export const SaveFearsSchema = z.object({
  fears: z.array(FearToSave).min(1),
});

export type FearToSave = z.infer<typeof FearToSave>;
