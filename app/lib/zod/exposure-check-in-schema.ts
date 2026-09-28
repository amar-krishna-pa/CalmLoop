import { z } from "zod";

export const CreateExposureCheckInSchema = z.strictObject({
  suds: z.number().int().min(0).max(10),
  notes: z.string().trim().max(2000).optional(),
});

export const CreateExposureCheckInResponseSchema = z.object({
  checkIn: z.object({
    id: z.string().uuid(),
    exposureId: z.string().uuid(),
    suds: z.number().int().min(0).max(10),
    notes: z.string().nullable(),
    completedAt: z.iso.datetime(),
  }),
  exposure: z.object({
    id: z.string().uuid(),
    currentSuds: z.number().int().min(0).max(10),
  }),
});
