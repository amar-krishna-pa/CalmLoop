import { z } from "zod";

export const SAFETY_BEHAVIOUR_CATEGORIES = [
  "Reassurance seeking",
  "Mental checking",
  "Avoidance",
  "Checking",
  "Washing/cleaning",
  "Ordering/arranging",
  "Repeating",
  "Confessing",
  "Other",
] as const;

export const SAFETY_BEHAVIOUR_FREQUENCIES = [
  "Rarely",
  "Sometimes",
  "Often",
  "Always",
] as const;

export const CreateSafetyBehaviourSchema = z.object({
  behaviour: z.string().min(1).max(300),
  category: z.enum(SAFETY_BEHAVIOUR_CATEGORIES),
  frequency: z.enum(SAFETY_BEHAVIOUR_FREQUENCIES),
});
