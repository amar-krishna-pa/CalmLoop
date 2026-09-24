import { z } from "zod";

import { EXPOSURE_PRACTICE_STATUSES } from "@/app/constants/exposures/practice-statuses";

export const UpdateExposurePracticeStatusSchema = z.strictObject({
  practiceStatus: z.enum(EXPOSURE_PRACTICE_STATUSES),
});

export const UpdateExposurePracticeStatusResponseSchema = z.object({
  exposure: z.object({
    id: z.string().uuid(),
    practiceStatus: z.enum(EXPOSURE_PRACTICE_STATUSES),
  }),
});
