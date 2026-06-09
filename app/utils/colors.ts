export const colors = {
  // --- Backgrounds ---
  bgPrimary: "bg-[#F4F6F4] dark:bg-[#141A17]",
  bgSurface: "bg-[#E8EDE8] dark:bg-[#1E2922]",
  bgCard: "bg-[#FFFFFF] dark:bg-[#1E2922]",

  // --- Text ---
  textPrimary: "text-[#1A2420] dark:text-[#E8EDE8]",
  textMuted: "text-[#6B7F6B] dark:text-[#7A9E84]",
  textOnAccent: "text-[#F4F6F4] dark:text-[#141A17]",

  // --- Accent ---
  accent: "bg-[#4A7C59] dark:bg-[#5E9E72]",
  accentText: "text-[#4A7C59] dark:text-[#5E9E72]",
  accentHover: "hover:bg-[#3A6347] dark:hover:bg-[#4E8A61]",
  accentBorder: "border-[#4A7C59] dark:border-[#5E9E72]",

  // --- Borders ---
  border: "border-[#D8E0D8] dark:border-[#2A3830]",

  // --- Inputs ---
  input:
    "bg-[#E8EDE8] dark:bg-[#1E2922] border-[#D8E0D8] dark:border-[#2A3830] text-[#1A2420] dark:text-[#E8EDE8]",

  // --- Focus ring ---
  focusRing:
    "focus:ring-2 focus:ring-[#4A7C59] dark:focus:ring-[#5E9E72] focus:outline-none",
} as const;

export const rawColors = {
  light: {
    bgPrimary: "#F4F6F4",
    bgSurface: "#E8EDE8",
    bgCard: "#FFFFFF",
    textPrimary: "#1A2420",
    textMuted: "#6B7F6B",
    accent: "#4A7C59",
    border: "#D8E0D8",
  },
  dark: {
    bgPrimary: "#141A17",
    bgSurface: "#1E2922",
    bgCard: "#1E2922",
    textPrimary: "#E8EDE8",
    textMuted: "#7A9E84",
    accent: "#5E9E72",
    border: "#2A3830",
  },
} as const;
