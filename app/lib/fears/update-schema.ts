import { z } from "zod";

import { THEMES } from "@/app/lib/fears/themes";

export const UpdateFearSchema = z.strictObject({
  name: z.string().trim().min(1).max(120),
  behaviours: z.array(z.string().trim().min(1).max(120)).optional(),
  themes: z.array(z.enum(THEMES)).transform((themes) => [...new Set(themes)]),
});
