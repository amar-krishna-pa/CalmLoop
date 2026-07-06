import { z } from "zod";

export const CreateFearHierarchyItemSchema = z.object({
  situation: z.string().min(1).max(300),
  initialSuds: z.number().int().min(0).max(10),
});

export const UpdateFearHierarchyItemSchema = z.object({
  currentSuds: z.number().int().min(0).max(10),
});
