import { z } from "zod";

export const CreateExposureTaskSchema = z.strictObject({
  action: z
    .string()
    .trim()
    .min(1, "Enter an action to practice.")
    .max(2000, "Keep the action to 2,000 characters or fewer."),
  compulsionsToAvoid: z.array(
    z
      .string()
      .trim()
      .min(1, "Enter a compulsion to avoid or remove the empty item.")
      .max(120, "Keep each compulsion to 120 characters or fewer."),
  ),
  expectedSuds: z
    .number()
    .int("Expected distress must be a whole number from 0 to 10.")
    .min(0, "Expected distress must be from 0 to 10.")
    .max(10, "Expected distress must be from 0 to 10."),
});
