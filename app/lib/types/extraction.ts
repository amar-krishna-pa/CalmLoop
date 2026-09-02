import type { THEMES } from "@/app/lib/themes/themes";

export type ExtractedFearPreview = {
  // Null when this is a fear the person has not recorded before.
  fearId: string | null;
  name: string;
  themes: (typeof THEMES)[number][];
  evidence: string;
  behaviours: string[];
};
