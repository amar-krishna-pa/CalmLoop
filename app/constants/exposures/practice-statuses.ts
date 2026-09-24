export const EXPOSURE_PRACTICE_STATUSES = [
  "available",
  "in_progress",
] as const;

export type ExposurePracticeStatus =
  (typeof EXPOSURE_PRACTICE_STATUSES)[number];
