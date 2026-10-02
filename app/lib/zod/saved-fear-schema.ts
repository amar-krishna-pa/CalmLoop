import { z } from "zod";
import { THEMES } from "@/app/constants/fears/themes";

export const SavedFearSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  themes: z.array(z.enum(THEMES)),
});

export type SavedFear = z.infer<typeof SavedFearSchema>;
