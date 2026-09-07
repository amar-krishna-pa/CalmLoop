import type { THEMES } from "@/app/lib/themes/themes";

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
