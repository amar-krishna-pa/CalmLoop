import { z } from "zod";

import { EXPOSURE_PRACTICE_STATUSES } from "@/app/constants/exposures/practice-statuses";

export const UpdateExposurePracticeStatusSchema = z.strictObject({
  practiceStatus: z.enum(EXPOSURE_PRACTICE_STATUSES),
});
