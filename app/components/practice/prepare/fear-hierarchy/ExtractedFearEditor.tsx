"use client";

import { useId, useState } from "react";
import SavedFearCombobox from "@/app/components/practice/prepare/fear-hierarchy/SavedFearCombobox";
import { LuTrash2 } from "react-icons/lu";

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
            <SavedFearCombobox
              savedFears={savedFears}
              isLoading={isLoadingSavedFears}
              error={savedFearsError}
              onLoad={onLoadSavedFears}
            />
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
