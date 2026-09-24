import type { Exposure } from "@/app/lib/zod/exposure-schema";

export const IN_PROGRESS_EXAMPLES: Exposure[] = [
  {
    id: "00000000-0000-4000-8000-000000000001",
    fearId: "00000000-0000-4000-8000-000000000011",
    fearName: "Making a mistake in a message",
    themes: ["Responsibility"],
    behaviours: ["Rereading before sending"],
    evidence: "Sending an email without rereading it",
    initialSuds: 6,
    currentSuds: 4,
    createdAt: "2026-09-20T09:00:00.000Z",
  },
  {
    id: "00000000-0000-4000-8000-000000000002",
    fearId: "00000000-0000-4000-8000-000000000012",
    fearName: "Touching shared surfaces",
    themes: ["Contamination"],
    behaviours: ["Cleaning after touching shared surfaces"],
    evidence: "Using a shared door handle",
    initialSuds: 7,
    currentSuds: 5,
    createdAt: "2026-09-19T09:00:00.000Z",
  },
  {
    id: "00000000-0000-4000-8000-000000000003",
    fearId: "00000000-0000-4000-8000-000000000013",
    fearName: "Leaving without checking again",
    themes: ["Checking"],
    behaviours: ["Returning to check appliances"],
    evidence: "Leaving an appliance without checking again",
    initialSuds: 8,
    currentSuds: 6,
    createdAt: "2026-09-18T09:00:00.000Z",
  },
];
