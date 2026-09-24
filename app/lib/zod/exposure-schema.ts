import { z } from "zod";

import { EXPOSURE_PRACTICE_STATUSES } from "@/app/constants/exposures/practice-statuses";
import { THEMES } from "@/app/constants/fears/themes";

export const ExposureSchema = z.object({
  id: z.string().uuid(),
  fearId: z.string().uuid(),
  fearName: z.string(),
  themes: z.array(z.enum(THEMES)),
  behaviours: z.array(z.string()),
  evidence: z.string(),
  initialSuds: z.number().int().min(0).max(10),
  currentSuds: z.number().int().min(0).max(10).nullable(),
  practiceStatus: z.enum(EXPOSURE_PRACTICE_STATUSES),
  createdAt: z.iso.datetime(),
});

export const ExposuresResponseSchema = z.object({
  exposures: z.array(ExposureSchema),
});

export type Exposure = z.infer<typeof ExposureSchema>;
