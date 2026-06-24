import { z } from "zod";

export const ChatRequestSchema = z.object({
  journalSessionId: z.string(),
  messages: z
    .array(
      z
        .object({
          id: z.string(),
          role: z.string(),
          parts: z.array(z.record(z.string(), z.unknown())),
        })
        .passthrough()
    )
    .min(1),
});
