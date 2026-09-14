"use client";

import { useId, useState } from "react";
import HorizontalDivider from "@/app/components/common/HorizontalDivider";
import SudsDropdown from "@/app/components/practice/prepare/fear-extraction/fear-preview/fear-editor/SudsDropdown";

type Props = {
  occurrence: { evidence: string; initialSuds: number };
  onDiscard: () => void;
};

export default function EditOccurrenceForm({ occurrence, onDiscard }: Props) {
  const evidenceId = useId();
  const distressId = useId();

  const [evidence, setEvidence] = useState(occurrence.evidence);
  const [initialSuds, setInitialSuds] = useState(occurrence.initialSuds);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="modal-scrollbar -m-1 min-h-0 flex-1 overflow-y-auto p-1">
        <div className="flex flex-col gap-4">
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
              className="input-base resize-y border-subtle/60 bg-modal/70"
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
        </div>
      </div>

      <div className="shrink-0 space-y-3">
        <HorizontalDivider />

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onDiscard}
            className="min-h-11 w-full cursor-pointer rounded-lg border border-transparent px-5 text-compact font-medium text-muted transition-colors duration-fast hover:border-subtle/60 hover:bg-modal-section hover:text-primary sm:w-auto"
          >
            Discard
          </button>

          <button
            type="button"
            disabled
            className="btn-accent flex min-h-11 w-full items-center justify-center px-5 disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-32 sm:w-auto"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}
