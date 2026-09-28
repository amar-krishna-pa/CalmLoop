"use client";

import { useId, useState } from "react";

import HorizontalDivider from "@/app/components/common/HorizontalDivider";
import Modal from "@/app/components/common/Modal";
import SudsDropdown from "@/app/components/practice/shared/SudsDropdown";
import type { Exposure } from "@/app/lib/zod/exposure-schema";

type Props = {
  exposure: Exposure;
  onClose: () => void;
};

export default function ExposureCheckInModal({ exposure, onClose }: Props) {
  const distressId = useId();
  const notesId = useId();
  const [currentSuds, setCurrentSuds] = useState<number | null>(null);
  const [notes, setNotes] = useState("");

  return (
    <Modal
      title="Add check-in"
      description="Record how this situation feels now."
      onClose={onClose}
    >
      <div className="flex min-h-0 flex-col gap-4">
        <div className="rounded-lg bg-modal-section p-3">
          <p className="wrap-break-words text-sm font-medium text-primary">
            {exposure.evidence}
          </p>
          <p className="mt-1 wrap-break-words text-xs text-muted">
            {exposure.fearName}
          </p>
        </div>

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
            onChange={({ value }) => setCurrentSuds(value)}
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

        <HorizontalDivider />

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 w-full cursor-pointer rounded-lg border border-transparent px-5 text-compact font-medium text-muted transition-colors duration-fast hover:border-subtle/60 hover:bg-modal-section hover:text-primary sm:w-auto"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled
            className="btn-accent flex min-h-11 w-full items-center justify-center px-5 disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-32 sm:w-auto"
          >
            Save check-in
          </button>
        </div>
      </div>
    </Modal>
  );
}
