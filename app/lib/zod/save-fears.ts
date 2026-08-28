import { z } from "zod";

import { THEMES } from "@/app/lib/themes/themes";

const FearToSave = z
  .object({
    // Null when this is a fear the person has not recorded before.
    fearId: z.string().uuid().nullable(),
    name: z.string().trim().min(1).max(120),
    themes: z.array(z.enum(THEMES)),
    behaviours: z.array(z.string().trim().min(1).max(120)),
    evidence: z.string().trim().min(1).max(2000),
    // Only new fears get rated — an existing one already carries its initial score.
    initialSuds: z.number().int().min(0).max(10).nullable(),
  })
  .refine((fear) => fear.fearId !== null || fear.initialSuds !== null, {
    message: "A new fear needs an initial SUDS rating",
    path: ["initialSuds"],
  });

export const SaveFearsSchema = z.object({
  fears: z.array(FearToSave).min(1),
});

export type FearToSave = z.infer<typeof FearToSave>;
