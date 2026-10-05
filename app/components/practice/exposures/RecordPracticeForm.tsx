"use client";

import { useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { z } from "zod";
import HorizontalDivider from "@/app/components/common/HorizontalDivider";
import LoadingSpinner from "@/app/components/loaders/LoadingSpinner";
import SudsDropdown from "@/app/components/practice/shared/SudsDropdown";
import { CreatePracticeAttemptSchema } from "@/app/lib/zod/create-practice-attempt-schema";

const SavedAttemptResponseSchema = z.object({
  attempt: z.object({
    id: z.string().uuid(),
    exposureTaskId: z.string().uuid(),
    suds: z.number().int().min(0).max(10),
    completedAt: z.iso.datetime(),
  }),
});

type Props = {
  exposureTaskId: string;
  taskAction: string;
  onCancel: () => void;
  onSaved: () => void;
  onSavingChange: ({ isSaving }: { isSaving: boolean }) => void;
};

export default function RecordPracticeForm({
  exposureTaskId,
  taskAction,
  onCancel,
  onSaved,
  onSavingChange,
}: Props) {
  const ratingId = useId();

  const [suds, setSuds] = useState<number | null>(null);
  const [validation, setValidation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const savingRef = useRef(false);

  async function savePractice() {
    if (savingRef.current) return;

    const parsed = CreatePracticeAttemptSchema.safeParse({ suds });
    setError(null);
    if (!parsed.success) {
      setValidation("Choose after-practice distress from 0 to 10.");
      return;
    }

    setValidation(null);
    savingRef.current = true;
    setIsSaving(true);
    onSavingChange({ isSaving: true });
    try {
      const response = await fetch(
        `/api/exposure-tasks/${exposureTaskId}/attempts`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed.data),
        },
      );

      if (!response.ok) {
        setError(
          response.status === 401
            ? "Please sign in to save your practice."
            : response.status === 404
              ? "This task isn’t available. You can choose another task."
              : response.status === 400
                ? "We couldn’t use this rating. Choose a rating from 0 to 10 and try again."
                : "We couldn’t save your practice. You can try again.",
        );
        return;
      }

      SavedAttemptResponseSchema.parse(await response.json());

      toast.success("Record saved.");
      onSaved();
    } catch {
      setError(
        "We couldn’t confirm whether your practice was saved. You can try again.",
      );
    } finally {
      savingRef.current = false;
      setIsSaving(false);
      onSavingChange({ isSaving: false });
    }
  }

  return (
    <form
      aria-label="Record practice"
      aria-busy={isSaving}
      className="flex min-h-0 flex-1 flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        void savePractice();
      }}
    >
      <fieldset
        disabled={isSaving}
        className="modal-scrollbar -m-1 min-h-0 flex-1 space-y-4 overflow-y-auto p-1"
      >
        <dl className="space-y-1.5">
          <dt className="text-xs font-medium text-muted">Task action</dt>
          <dd className="whitespace-pre-wrap wrap-break-words text-sm text-primary">
            {taskAction}
          </dd>
        </dl>
        <div className="space-y-1.5">
          <label
            htmlFor={ratingId}
            className="text-xs font-medium text-primary"
          >
            After-practice distress
          </label>
          <p id={`${ratingId}-help`} className="text-xs text-muted">
            How distressing did it feel after practice? 0 means no distress; 10
            means extreme distress.
          </p>

          <SudsDropdown
            id={ratingId}
            value={suds}
            onChange={({ value }) => {
              setSuds(value);
              setValidation(null);
            }}
            disabled={isSaving}
            aria-invalid={Boolean(validation)}
            aria-describedby={`${ratingId}-help ${ratingId}-feedback`}
          />

          <p
            id={`${ratingId}-feedback`}
            aria-live="polite"
            className="text-xs text-danger empty:hidden"
          >
            {validation}
          </p>
        </div>
      </fieldset>

      <HorizontalDivider />

      <div className="shrink-0" aria-live="polite">
        <AnimatePresence initial={false}>
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <p role="alert" className="pb-3 text-xs text-danger">
                {error}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            disabled={isSaving}
            onClick={() => {
              if (!savingRef.current) onCancel();
            }}
            className="min-h-10 cursor-pointer rounded-lg px-4 text-xs text-muted transition-colors duration-fast hover:bg-modal-section disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSaving}
            aria-label={isSaving ? "Saving practice" : "Save practice"}
            className="btn-accent flex min-h-10 min-w-32 cursor-pointer items-center justify-center px-4 text-xs disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? <LoadingSpinner /> : "Save practice"}
          </button>
        </div>
      </div>
    </form>
  );
}
