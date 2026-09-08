"use client";

import { useState } from "react";

import Modal from "@/app/components/common/Modal";
import ExtractedFearEditor from "@/app/components/practice/prepare/fear-hierarchy/ExtractedFearEditor";
import type { ExtractedFearPreview, PreviewFear } from "@/app/lib/types/extraction";

import type { FearToSave } from "@/app/lib/zod/save-fears";

type Props = {
  fears: ExtractedFearPreview[];
  onDiscard: () => void;
  onSave: ({ fears }: { fears: FearToSave[] }) => void;
};

export default function ExtractionPreviewModal({ fears: initialFears, onDiscard, onSave }: Props) {
  const [fears, setFears] = useState<PreviewFear[]>(
    initialFears.map((fear) => ({ ...fear, initialSuds: null }))
  );

  function updateFear({ fear }: { fear: PreviewFear }) {
    setFears((currentFears) =>
      currentFears.map((currentFear) =>
        currentFear?.evidence === fear.evidence ? fear : currentFear
      )
    );
  }

  function removeFear({ fear }: { fear: PreviewFear }) {
    const remainingFears = fears.filter((currentFear) => currentFear?.evidence !== fear.evidence);

    if (remainingFears.length === 0) {
      onDiscard();
      return;
    }

    setFears(remainingFears);
  }

  const canSave = fears.every(
    (fear) =>
      fear.name.trim() &&
      fear.evidence.trim() &&
      (fear.fearId !== null || fear.initialSuds !== null)
  );

  return (
    <Modal title="Review your entry" description="You can edit anything before saving." onClose={onDiscard} size="large">
      <div className="flex min-h-0 flex-col gap-4">
        <div className="modal-scrollbar min-h-0 max-h-[58vh] overflow-y-auto pr-1">
          <div className="flex flex-col gap-4">
            {fears.map((fear, fearIndex) => (
              <div
                key={`${fear.evidence}`}
                className="border-b-2 border-subtle pb-4 last:border-b-0 last:pb-0"
              >
              <ExtractedFearEditor
                fear={fear}
                fearIndex={fearIndex}
                fearCount={fears.length}
                onChange={({ fear: updatedFear }) =>
                  updateFear({ fear: updatedFear })
                }
                onRemove={() => removeFear({ fear: fear })}
              />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-subtle/60 pt-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-2xs text-muted">Only save what feels accurate.</p>
          
          <div className="flex w-full flex-col-reverse gap-2 sm:w-auto sm:flex-row">
            <button
              type="button"
              onClick={onDiscard}
              className="min-h-11 w-full cursor-pointer rounded-lg border border-transparent px-5 text-compact font-medium text-muted transition-colors duration-fast hover:border-subtle/60 hover:bg-modal-section hover:text-primary sm:w-auto"
            >
              Discard
            </button>

            <button
              type="button"
              onClick={() =>
                onSave({
                  fears: fears.map((fear) => ({
                    ...fear,
                    behaviours: fear.behaviours.map(({ value }) => value),
                  })),
                })
              }
              disabled={!canSave}
              className="btn-accent min-h-11 w-full cursor-pointer px-5 duration-fast disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-32 sm:w-auto"
            >
              Save entry
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
