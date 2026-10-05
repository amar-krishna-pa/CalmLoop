import { z } from "zod";

export const CreatePracticeAttemptSchema = z.strictObject({
  suds: z
    .number()
    .int("After-practice distress must be a whole number from 0 to 10.")
    .min(0, "After-practice distress must be from 0 to 10.")
    .max(10, "After-practice distress must be from 0 to 10."),
});
