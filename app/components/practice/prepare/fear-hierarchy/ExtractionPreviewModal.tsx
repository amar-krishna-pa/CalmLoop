"use client";

import { useState } from "react";
import { z } from "zod";

import Modal from "@/app/components/common/Modal";
import LoadingSpinner from "@/app/components/loaders/LoadingSpinner";
import ExtractedFearEditor from "@/app/components/practice/prepare/fear-hierarchy/ExtractedFearEditor";
import type { ExtractedFearPreview, PreviewFear } from "@/app/lib/types/extraction";

import { SaveFearsSchema, type FearToSave } from "@/app/lib/zod/save-fears";

const SavedFearsResponseSchema = z.object({
  fears: z.array(z.object({ id: z.string().uuid(), name: z.string() })),
});

type Props = {
  fears: ExtractedFearPreview[];
  isSaving: boolean;
  onDiscard: () => void;
  onSave: ({ fears }: { fears: FearToSave[] }) => void;
};

export default function ExtractionPreviewModal({ fears: initialFears, isSaving, onDiscard, onSave }: Props) {
  const [fears, setFears] = useState<PreviewFear[]>(
    initialFears.map((fear) => ({ ...fear, initialSuds: null }))
  );
  const [savedFears, setSavedFears] = useState<{ id: string; name: string }[] | null>(null);
  const [isLoadingSavedFears, setIsLoadingSavedFears] = useState(false);
  const [savedFearsError, setSavedFearsError] = useState<string | null>(null);

  async function loadSavedFears() {
    if (savedFears !== null || isLoadingSavedFears) return;

    setIsLoadingSavedFears(true);
    setSavedFearsError(null);
    try {
      const response = await fetch("/api/fears");
      if (response.status === 401) {
        setSavedFearsError("Please sign in again to load your saved fears.");
        return;
      }
      if (!response.ok) throw new Error("Could not load saved fears");

      const data = SavedFearsResponseSchema.parse(await response.json());
      setSavedFears(data.fears);
    } catch {
      setSavedFearsError("Could not load saved fears. Please try again.");
    } finally {
      setIsLoadingSavedFears(false);
    }
  }

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

  const savePayload = SaveFearsSchema.safeParse({
    fears: fears.map((fear) => ({
      ...fear,
      behaviours: fear.behaviours.map(({ value }) => value),
    })),
  });

  return (
    <Modal title="Review your entry" description="You can edit anything before saving." onClose={onDiscard} size="large">
      <div className="flex min-h-0 flex-col gap-4">
        <div className="modal-scrollbar min-h-0 max-h-[58vh] overflow-y-auto pr-1">
          <fieldset disabled={isSaving} className="flex min-w-0 flex-col gap-4">
            {fears.map((fear, fearIndex) => (
              <div
                key={`${fear.evidence}`}
                className="border-b-2 border-subtle pb-4 last:border-b-0 last:pb-0"
              >
              <ExtractedFearEditor
                fear={fear}
                fearIndex={fearIndex}
                fearCount={fears.length}
                onLoadSavedFears={loadSavedFears}
                isLoadingSavedFears={isLoadingSavedFears}
                savedFearsError={savedFearsError}
                savedFears={savedFears}
                onChange={({ fear: updatedFear }) =>
                  updateFear({ fear: updatedFear })
                }
                onRemove={() => removeFear({ fear: fear })}
              />
              </div>
            ))}
          </fieldset>
        </div>

        <div className="flex flex-col gap-3 border-t border-subtle/60 pt-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-2xs text-muted">Only save what feels accurate.</p>
          
          <div className="flex w-full flex-col-reverse gap-2 sm:w-auto sm:flex-row">
            <button
              type="button"
              onClick={onDiscard}
              disabled={isSaving}
              className="min-h-11 w-full cursor-pointer rounded-lg border border-transparent px-5 text-compact font-medium text-muted transition-colors duration-fast hover:border-subtle/60 hover:bg-modal-section hover:text-primary sm:w-auto"
            >
              Discard
            </button>

            <button
              type="button"
              onClick={() => {
                if (!savePayload.success || isSaving) return;
                onSave(savePayload.data);
              }}
              disabled={!savePayload.success || isSaving}
              aria-label={isSaving ? "Saving entry" : "Save entry"}
              className="btn-accent min-h-11 w-full cursor-pointer px-5 duration-fast disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-32 sm:w-auto"
            >
              {isSaving ? <LoadingSpinner /> : "Save entry"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
