import type { THEMES } from "@/app/lib/fears/themes";

export type PreviewBehaviour = {
  id: string;
  value: string;
};

export type ExtractedFearPreview = {
  fearId: string | null;
  name: string;
  themes: (typeof THEMES)[number][];
  evidence: string;
  behaviours: PreviewBehaviour[];
};

export type PreviewFear = ExtractedFearPreview & {
  initialSuds: number | null;
};
