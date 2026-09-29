"use client";

import { type FormEvent, useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";

import HorizontalDivider from "@/app/components/common/HorizontalDivider";
import Modal from "@/app/components/common/Modal";
import LoadingSpinner from "@/app/components/loaders/LoadingSpinner";
import SudsDropdown from "@/app/components/practice/shared/SudsDropdown";
import type { Exposure } from "@/app/lib/zod/exposure-schema";
import { CreateExposureCheckInResponseSchema } from "@/app/lib/zod/exposure-check-in-schema";

type Props = {
  exposure: Exposure;
  onClose: () => void;
  onSaved: ({
    exposureId,
    currentSuds,
  }: {
    exposureId: string;
    currentSuds: number;
  }) => void;
};

export default function ExposureCheckInModal({
  exposure,
  onClose,
  onSaved,
}: Props) {
  const distressId = useId();
  const notesId = useId();
  const [currentSuds, setCurrentSuds] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function saveCheckIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (currentSuds === null) {
      setError("Choose a current distress rating from 0 to 10.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/exposures/${exposure.id}/check-ins`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          suds: currentSuds,
          ...(notes.trim() ? { notes: notes.trim() } : {}),
        }),
      });

      if (!response.ok) {
        throw new Error("Check-in creation failed");
      }

      const data = CreateExposureCheckInResponseSchema.parse(
        await response.json(),
      );

      onSaved({
        exposureId: data.exposure.id,
        currentSuds: data.exposure.currentSuds,
      });
      toast.success("Check-in saved.");
    } catch {
      setError("We couldn’t save this check-in. You can try again.");
      setIsSaving(false);
    }
  }

  return (
    <Modal
      title="Add check-in"
      description="How distressing does this situation feel now?"
      onClose={() => {
        if (!isSaving) onClose();
      }}
    >
      <form
        onSubmit={saveCheckIn}
        aria-busy={isSaving}
        className="flex min-h-0 flex-col gap-4"
      >
        <div className="rounded-lg bg-modal-section p-3">
          <p className="wrap-break-words text-sm font-medium text-primary">
            {exposure.evidence}
          </p>
          <p className="mt-1 wrap-break-words text-xs text-muted">
            {exposure.fearName}
          </p>
        </div>

        <fieldset disabled={isSaving} className="contents">
          <div className="space-y-1.5">
            <label
              htmlFor={distressId}
              className="text-xs font-medium text-primary"
            >
              Current distress
            </label>
            <SudsDropdown
              id={distressId}
              value={currentSuds}
              onChange={({ value }) => {
                setCurrentSuds(value);
                setError(null);
              }}
            />
            <p className="text-xs text-muted">
              Choose from 0 (no distress) to 10 (extreme distress).
            </p>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor={notesId}
              className="text-xs font-medium text-primary"
            >
              Notes <span className="font-normal text-muted">(optional)</span>
            </label>
            <textarea
              id={notesId}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              maxLength={2000}
              rows={4}
              placeholder="Add anything you noticed during practice."
              className="input-base resize-y border-subtle/60 bg-modal/70"
            />
          </div>
        </fieldset>

        <AnimatePresence initial={false}>
          {error && (
            <motion.p
              key="check-in-error"
              role="alert"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden text-xs text-danger"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <HorizontalDivider />

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="min-h-11 w-full cursor-pointer rounded-lg border border-transparent px-5 text-compact font-medium text-muted transition-colors duration-fast hover:border-subtle/60 hover:bg-modal-section hover:text-primary disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            aria-label={isSaving ? "Saving check-in" : undefined}
            className="btn-accent flex min-h-11 w-full items-center justify-center px-5 disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-32 sm:w-auto cursor-pointer"
          >
            {isSaving ? <LoadingSpinner /> : "Save check-in"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
