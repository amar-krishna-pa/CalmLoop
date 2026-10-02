import type { THEMES } from "@/app/constants/fears/themes";

export type PreviewBehavior = {
  id: string;
  value: string;
};

export type ExtractedFearPreview = {
  fearId: string | null;
  name: string;
  themes: (typeof THEMES)[number][];
  occurrence: {
    evidence: string;
    behaviors: PreviewBehavior[];
  };
};

export type PreviewFear = ExtractedFearPreview & {
  previewId: string;
  occurrence: ExtractedFearPreview["occurrence"] & {
    initialSuds: number | null;
  };
};
