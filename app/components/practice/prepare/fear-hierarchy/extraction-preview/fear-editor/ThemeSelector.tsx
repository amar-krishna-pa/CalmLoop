"use client";
import { LuChevronDown } from "react-icons/lu";
import { cn } from "@/app/lib/cn/cn";
import { THEMES } from "@/app/lib/themes/themes";
import { AnimatePresence, motion } from "motion/react";

type Theme = (typeof THEMES)[number];

type Props = {
  selectedThemes: Theme[];
  isExpanded: boolean;
  toggleExpandedSection: () => void;
  onToggle: ({ theme }: { theme: Theme }) => void;
};

export default function ThemeSelector({
  selectedThemes,
  isExpanded,
  toggleExpandedSection,
  onToggle,
}: Props) {
  const unselectedThemes = THEMES.filter(
    (theme) => !selectedThemes.includes(theme),
  );

  return (
    <fieldset>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <legend className="text-xs font-medium text-primary">Themes</legend>
        <button
          type="button"
          onClick={toggleExpandedSection}
          aria-expanded={isExpanded}
          className="flex cursor-pointer items-center gap-1 text-2xs font-medium text-accent"
        >
          <LuChevronDown
            size={13}
            className={cn(
              "transition-transform duration-200 ease-out",
              isExpanded && "rotate-180",
            )}
          />
          {isExpanded ? "Collapse themes" : "Show all themes"}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <AnimatePresence initial={false} mode="popLayout">
          {selectedThemes.map((theme) => (
            <motion.button
              key={theme}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              type="button"
              aria-pressed="true"
              onClick={() => onToggle({ theme })}
              className="cursor-pointer rounded-full border-2 border-accent bg-modal px-3 py-1.5 text-xs text-primary transition-colors hover:border-warning-text"
            >
              {theme}
            </motion.button>
          ))}

          {selectedThemes.length === 0 && (
            <motion.span
              key="empty-label"
              className="border-2 border-transparent py-1.5 text-xs text-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              No themes selected
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            className="mt-2 flex flex-wrap gap-2 p-0.5 overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <AnimatePresence initial={false} mode="popLayout">
              {unselectedThemes.map((theme) => (
                <motion.button
                  key={theme}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  type="button"
                  aria-pressed="false"
                  onClick={() => onToggle({ theme })}
                  className="cursor-pointer rounded-full border-2 border-subtle bg-modal px-3 py-1.5 text-xs text-primary transition-colors hover:border-accent"
                >
                  {theme}
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </fieldset>
  );
}
