"use client";

import { useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { z } from "zod";

import HorizontalDivider from "@/app/components/common/HorizontalDivider";
import LoadingSpinner from "@/app/components/loaders/LoadingSpinner";
import type { CompulsionDraft } from "@/app/components/practice/exposures/CompulsionsToAvoidEditor";
import ExposureTaskFields, {
  type ExposureTaskFieldErrors,
} from "@/app/components/practice/exposures/ExposureTaskFields";
import { CreateExposureTaskSchema } from "@/app/lib/zod/create-exposure-task-schema";

const SavedTaskResponseSchema = z.object({
  task: z.object({ id: z.string().uuid(), fearId: z.string().uuid() }),
});

type Props = {
  fearId: string;
  fearName: string;
  onCancel: () => void;
  onSaved: () => void;
  onSavingChange: ({ isSaving }: { isSaving: boolean }) => void;
};

export default function CreateExposureTaskForm({
  fearId,
  fearName,
  onCancel,
  onSaved,
  onSavingChange,
}: Props) {
  const formId = useId();

  const [action, setAction] = useState("");
  const [compulsions, setCompulsions] = useState<CompulsionDraft[]>([]);
  const [expectedSuds, setExpectedSuds] = useState<number | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ExposureTaskFieldErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const savingRef = useRef(false);

  async function saveTask() {
    if (savingRef.current) return;

    const parsed = CreateExposureTaskSchema.safeParse({
      action,
      compulsionsToAvoid: compulsions.map(({ value }) => value),
      expectedSuds,
    });
    setError(null);
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      setFieldErrors({
        ...errors,
        expectedSuds:
          expectedSuds === null
            ? ["Choose expected distress from 0 to 10."]
            : errors.expectedSuds,
      });
      return;
    }

    setFieldErrors({});
    savingRef.current = true;
    setIsSaving(true);
    onSavingChange({ isSaving: true });

    try {
      const response = await fetch(`/api/fears/${fearId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (!response.ok) {
        setError(
          response.status === 401
            ? "Please sign in to save a task."
            : response.status === 404
              ? "This fear isn’t available. You can choose another saved fear."
              : response.status === 400
                ? "We couldn’t use these details. Review the fields and try again."
                : "We couldn’t save this task. You can try again.",
        );
        return;
      }

      const data = SavedTaskResponseSchema.parse(await response.json());
      if (data.task.fearId !== fearId) throw new Error("Unexpected fear");

      setAction("");
      setCompulsions([]);
      setExpectedSuds(null);
      toast.success("Task saved.");
      onSaved();
    } catch {
      setError(
        "We couldn’t confirm whether this task was saved. You can try again.",
      );
    } finally {
      savingRef.current = false;
      setIsSaving(false);
      onSavingChange({ isSaving: false });
    }
  }

  return (
    <form
      aria-labelledby={`${formId}-heading`}
      aria-busy={isSaving}
      className="flex min-h-0 flex-1 flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        void saveTask();
      }}
    >
      <h3 id={`${formId}-heading`} className="sr-only">
        Create a task
      </h3>

      <ExposureTaskFields
        formId={formId}
        fearName={fearName}
        action={action}
        compulsions={compulsions}
        expectedSuds={expectedSuds}
        fieldErrors={fieldErrors}
        isSaving={isSaving}
        onActionChange={({ action: updated }) => setAction(updated)}
        onCompulsionsChange={({ compulsions: updated }) =>
          setCompulsions(updated)
        }
        onExpectedSudsChange={({ expectedSuds: updated }) =>
          setExpectedSuds(updated)
        }
      />

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
              <p role="alert" className="pb-2 text-xs text-danger">
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
            className="min-h-10 cursor-pointer rounded-lg px-4 text-xs text-muted transition-colors duration-fast hover:bg-surface hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            aria-label={isSaving ? "Saving task" : "Save task"}
            className="btn-accent flex min-h-10 min-w-28 cursor-pointer items-center justify-center px-4 text-xs disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? <LoadingSpinner /> : "Save task"}
          </button>
        </div>
      </div>
    </form>
  );
}
