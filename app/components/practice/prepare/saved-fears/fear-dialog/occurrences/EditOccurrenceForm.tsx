"use client";

import { useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { z } from "zod";
import HorizontalDivider from "@/app/components/common/HorizontalDivider";
import LoadingSpinner from "@/app/components/loaders/LoadingSpinner";
import SafetyBehaviorsEditor from "@/app/components/practice/shared/SafetyBehaviorsEditor";
import SudsDropdown from "@/app/components/practice/shared/SudsDropdown";
import {
  OccurrenceSchema,
  type Occurrence,
} from "@/app/lib/zod/occurrence-schema";
import { UpdateOccurrenceSchema } from "@/app/lib/zod/update-occurrence-schema";
import type { PreviewBehavior } from "@/app/types/fears";

const SavedOccurrenceResponseSchema = z.object({
  occurrence: OccurrenceSchema,
});

type Props = {
  fearId: string;
  occurrence: Occurrence;
  onDiscard: () => void;
  onSaved: ({ occurrence }: { occurrence: Occurrence }) => void;
  onSavingChange: ({ isSaving }: { isSaving: boolean }) => void;
};

export default function EditOccurrenceForm({
  fearId,
  occurrence,
  onDiscard,
  onSaved,
  onSavingChange,
}: Props) {
  const evidenceId = useId();
  const distressId = useId();

  const [evidence, setEvidence] = useState(occurrence.evidence);
  const [initialSuds, setInitialSuds] = useState(occurrence.initialSuds);
  const [behaviors, setBehaviors] = useState<PreviewBehavior[]>(() =>
    occurrence.behaviors.map((value) => ({ id: crypto.randomUUID(), value })),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const savingRef = useRef(false);

  const savePayload = UpdateOccurrenceSchema.safeParse({
    evidence,
    initialSuds,
    behaviors: behaviors.map(({ value }) => value),
  });

  async function saveOccurrence() {
    if (savingRef.current || !savePayload.success) return;

    savingRef.current = true;
    setIsSaving(true);
    onSavingChange({ isSaving: true });
    setError(null);

    try {
      const response = await fetch(
        `/api/fears/${fearId}/occurrences/${occurrence.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(savePayload.data),
        },
      );

      if (!response.ok) {
        setError(
          response.status === 401
            ? "Please sign in to save your changes."
            : response.status === 404
              ? "This entry isn’t available. You can copy your draft before closing this window."
              : response.status === 400
                ? "We couldn’t use these details. Review your entry and try again."
                : "We couldn’t save your changes. You can try again.",
        );
        return;
      }

      const data = SavedOccurrenceResponseSchema.parse(await response.json());
      if (data.occurrence.id !== occurrence.id) {
        throw new Error("Unexpected entry");
      }
      onSaved({ occurrence: data.occurrence });
    } catch {
      setError(
        "We couldn’t confirm whether your changes were saved. You can try again.",
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
        void saveOccurrence();
      }}
    >
      <div className="modal-scrollbar -m-1 min-h-0 flex-1 overflow-y-auto p-1">
        <fieldset disabled={isSaving} className="flex min-w-0 flex-col gap-4">
          <div className="space-y-1.5">
            <label
              htmlFor={evidenceId}
              className="text-xs font-medium text-primary"
            >
              What happened?
            </label>
            <textarea
              id={evidenceId}
              value={evidence}
              onChange={(event) => setEvidence(event.target.value)}
              maxLength={2000}
              rows={6}
              className="input-base h-32 resize-y border-subtle/60 bg-modal/70"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor={distressId}
              className="text-xs font-medium text-primary"
            >
              Initial distress — how it felt at the time
            </label>
            <SudsDropdown
              id={distressId}
              value={initialSuds}
              onChange={({ value }) => setInitialSuds(value)}
            />
          </div>
          <SafetyBehaviorsEditor
            behaviors={behaviors}
            onChange={({ behaviors: updated }) => setBehaviors(updated)}
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
                      Enter a situation with 1–2,000 characters and use 1–120
                      characters for each safety behavior.
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
            aria-label={isSaving ? "Saving entry" : "Save entry"}
            className="btn-accent flex min-h-11 w-full items-center justify-center px-5 disabled:cursor-not-allowed disabled:opacity-50 sm:w-40 cursor-pointer"
          >
            {isSaving ? <LoadingSpinner /> : "Save entry"}
          </button>
        </div>
      </div>
    </form>
  );
}
