"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LuTrash2 } from "react-icons/lu";
import LoadingSpinner from "@/app/components/loaders/LoadingSpinner";

import SafetyBehavioursEditor from "@/app/components/practice/prepare/fear-hierarchy/SafetyBehavioursEditor";
import SudsDropdown from "@/app/components/practice/prepare/fear-hierarchy/SudsDropdown";
import ThemeSelector from "@/app/components/practice/prepare/fear-hierarchy/ThemeSelector";
import type { PreviewFear } from "@/app/lib/types/extraction";

type Props = {
  fear: PreviewFear;
  fearIndex: number;
  fearCount: number;
  onChange: ({ fear }: { fear: PreviewFear }) => void;
  onRemove: () => void;
  onLoadSavedFears: () => void;
  isLoadingSavedFears: boolean;
  savedFearsError: string | null;
  savedFears: { id: string; name: string }[] | null;
};

export default function ExtractedFearEditor({
  fear,
  fearCount,
  onChange,
  onRemove,
  onLoadSavedFears,
  isLoadingSavedFears,
  savedFearsError,
  savedFears,
}: Props) {
  const situationId = useId();
  const savedFearsListId = useId();

  const [isMatchExpanded, setIsMatchExpanded] = useState(false);
  const [isThemeEditorExpanded, setIsThemeEditorExpanded] = useState(false);

  console.log(fear);

  return (
    <section className="rounded-xl bg-modal-section/70 p-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5 text-xs font-medium text-primary">
          <div className="flex items-center gap-2">
            <label htmlFor={situationId}>Situation</label>
            <span className="inline-flex items-center rounded bg-accent/20 px-1.5 py-0.5 text-2xs font-semibold text-accent">
              {fear.fearId ? "Matched" : "New"}
            </span>
            {fearCount > 1 && (
              <button
                type="button"
                onClick={onRemove}
                aria-label={`Remove ${fear.name}`}
                className="icon-btn ml-auto shrink-0 cursor-pointer hover:border-danger hover:text-danger"
              >
                <LuTrash2 size={14} />
              </button>
            )}
          </div>
          <input
            id={situationId}
            value={fear.name}
            onChange={(event) =>
              onChange({ fear: { ...fear, name: event.target.value } })
            }
            disabled={fear.fearId !== null}
            maxLength={120}
            className="input-base border-subtle/60 bg-modal/70 disabled:cursor-not-allowed disabled:opacity-60"
          />
          {fear.fearId && (
            <button
              type="button"
              onClick={() => onChange({ fear: { ...fear, fearId: null } })}
              className="flex min-h-5 self-start items-center text-left text-2xs font-medium text-accent cursor-pointer transition-opacity duration-fast hover:opacity-80"
            >
              Save as a new fear instead
            </button>
          )}

          {fear.fearId === null && (
            <div className="flex flex-col items-start gap-1.5">
              <button
                type="button"
                onClick={() => {
                  if (savedFearsError) {
                    setIsMatchExpanded(true);
                    onLoadSavedFears();
                    return;
                  }
                  setIsMatchExpanded(!isMatchExpanded);
                  if (!isMatchExpanded) onLoadSavedFears();
                }}
                disabled={isLoadingSavedFears}
                aria-expanded={isMatchExpanded}
                aria-controls={savedFearsListId}
                aria-label={
                  isLoadingSavedFears ? "Loading saved fears" : undefined
                }
                className="flex min-h-5 self-start items-center text-left text-2xs font-medium text-accent cursor-pointer transition-opacity duration-fast hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoadingSavedFears ? (
                  <LoadingSpinner />
                ) : savedFearsError ? (
                  "Retry loading saved fears"
                ) : isMatchExpanded ? (
                  "Hide saved fears"
                ) : (
                  "Match an existing fear"
                )}
              </button>
              <p role="status" className="text-2xs text-muted empty:hidden">
                {savedFearsError}
              </p>
              <AnimatePresence initial={false}>
                {isMatchExpanded && savedFears !== null && (
                  <motion.div
                    id={savedFearsListId}
                    key="saved-fears"
                    className="w-full overflow-hidden"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    {savedFears.length === 0 ? (
                      <p className="py-1 text-2xs font-normal text-muted">
                        No saved fears yet.
                      </p>
                    ) : (
                      <ul
                        aria-label="Saved fears"
                        className="max-h-48 overflow-y-auto rounded-lg border border-subtle bg-modal/70 text-xs font-normal text-primary"
                      >
                        {savedFears.map((savedFear) => (
                          <li
                            key={savedFear.id}
                            className="border-b border-subtle px-3 py-2 last:border-b-0"
                          >
                            {savedFear.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        <ThemeSelector
          selectedThemes={fear.themes}
          isExpanded={isThemeEditorExpanded}
          toggleExpandedSection={() =>
            setIsThemeEditorExpanded((prev) => !prev)
          }
          onToggle={({ theme }) =>
            onChange({
              fear: {
                ...fear,
                themes: fear.themes.includes(theme)
                  ? fear.themes.filter(
                      (selectedTheme) => selectedTheme !== theme,
                    )
                  : [...fear.themes, theme],
              },
            })
          }
        />

        <SafetyBehavioursEditor
          behaviours={fear.behaviours}
          onChange={({ behaviours }) =>
            onChange({ fear: { ...fear, behaviours } })
          }
        />

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={fear?.evidence}
            className="text-xs font-medium text-primary"
          >
            How distressing did this feel?
          </label>
          <SudsDropdown
            id={fear?.evidence}
            value={fear.initialSuds}
            onChange={({ value }) =>
              onChange({ fear: { ...fear, initialSuds: value } })
            }
          />
        </div>
      </div>
    </section>
  );
}
