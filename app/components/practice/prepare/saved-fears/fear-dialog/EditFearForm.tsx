"use client";

import { useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import HorizontalDivider from "@/app/components/common/HorizontalDivider";
import ThemeSelector from "@/app/components/practice/shared/ThemeSelector";
import {
  SavedFearSchema,
  type SavedFear,
} from "@/app/lib/zod/saved-fear-schema";
import { UpdateFearSchema } from "@/app/lib/zod/update-fear-schema";
import LoadingSpinner from "@/app/components/loaders/LoadingSpinner";

type Props = {
  onDiscard: () => void;
  fear: SavedFear;
  onSaved: ({ fear }: { fear: SavedFear }) => void;
  onSavingChange: ({ isSaving }: { isSaving: boolean }) => void;
};

export default function EditFearForm({
  fear,
  onDiscard,
  onSaved,
  onSavingChange,
}: Props) {
  const nameId = useId();

  const [name, setName] = useState(fear.name);
  const [themes, setThemes] = useState(fear.themes);
  const [isThemeEditorExpanded, setIsThemeEditorExpanded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const savingRef = useRef(false);

  const savePayload = UpdateFearSchema.safeParse({ name, themes });

  async function saveFear() {
    if (savingRef.current || !savePayload.success) return;

    savingRef.current = true;
    setIsSaving(true);
    onSavingChange({ isSaving: true });
    setError(null);

    try {
      const response = await fetch(`/api/fears/${fear.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(savePayload.data),
      });

      if (!response.ok) {
        setError(
          response.status === 401
            ? "Please sign in to save your changes."
            : response.status === 404
              ? "This fear isn’t available. You can copy your draft before closing this window."
              : response.status === 400
                ? "The fear name and themes couldn’t be saved. Review them and try again."
                : "We couldn’t save your changes. Your draft is still here.",
        );
        return;
      }

      const data = await response.json();
      const updated = SavedFearSchema.parse(data.fear);
      if (updated.id !== fear.id) throw new Error("Unexpected fear");

      onSaved({ fear: updated });
    } catch {
      setError(
        "We couldn’t confirm whether your changes were saved. Your draft is still here.",
      );
    } finally {
      savingRef.current = false;
      setIsSaving(false);
      onSavingChange({ isSaving: false });
    }
  }

  return (
    <form
      className="flex min-h-0 flex-1 flex-col gap-4"
      aria-busy={isSaving}
      onSubmit={(event) => {
        event.preventDefault();
        void saveFear();
      }}
    >
      <div className="modal-scrollbar -m-1 min-h-0 flex-1 overflow-y-auto p-1">
        <fieldset
          disabled={isSaving}
          className="flex min-w-0 flex-col gap-4 rounded-xl bg-modal-section/70"
        >
          <div className="space-y-1.5">
            <label
              htmlFor={nameId}
              className="text-xs font-medium text-primary"
            >
              Fear name
            </label>
            <input
              id={nameId}
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={120}
              className="input-base border-subtle/60 bg-modal/70"
            />
          </div>

          <ThemeSelector
            selectedThemes={themes}
            isExpanded={isThemeEditorExpanded}
            toggleExpandedSection={() =>
              setIsThemeEditorExpanded((current) => !current)
            }
            onToggle={({ theme }) =>
              setThemes((current) =>
                current.includes(theme)
                  ? current.filter((selected) => selected !== theme)
                  : [...current, theme],
              )
            }
          />
        </fieldset>
      </div>

      <div className="shrink-0 space-y-3">
        <HorizontalDivider />

        <div className="empty:hidden" aria-live="polite">
          <AnimatePresence initial={false}>
            {(error || !savePayload.success) && (
              <motion.div
                key="feedback"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="space-y-2">
                  {error && (
                    <p role="alert" className="text-sm text-danger">
                      {error}
                    </p>
                  )}
                  {!savePayload.success && (
                    <p className="text-xs text-muted">
                      Enter a fear name with 1–120 characters.
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => {
              if (!savingRef.current) onDiscard();
            }}
            disabled={isSaving}
            className="min-h-11 w-full cursor-pointer rounded-lg border border-transparent px-5 text-compact font-medium text-muted transition-colors duration-fast hover:border-subtle/60 hover:bg-modal-section hover:text-primary sm:w-auto"
          >
            Discard
          </button>

          <button
            type="submit"
            disabled={isSaving || !savePayload.success}
            aria-label={isSaving ? "Saving fear" : "Save changes"}
            className="btn-accent flex min-h-11 w-full items-center justify-center px-5 disabled:cursor-not-allowed disabled:opacity-50 sm:w-40 cursor-pointer"
          >
            {isSaving ? <LoadingSpinner /> : "Save changes"}
          </button>
        </div>
      </div>
    </form>
  );
}
