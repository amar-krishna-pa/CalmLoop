import { z } from "zod";
import { THEMES } from "@/app/lib/fears/themes";

export const SavedFearSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  themes: z.array(z.enum(THEMES)),
  behaviours: z.array(z.string()),
});

export type SavedFear = z.infer<typeof SavedFearSchema>;
