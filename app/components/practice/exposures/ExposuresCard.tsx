"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { z } from "zod";
import HorizontalDivider from "@/app/components/common/HorizontalDivider";
import ExposureFearSelectorLoader from "@/app/components/loaders/ExposureFearSelectorLoader";
import LoadingSpinner from "@/app/components/loaders/LoadingSpinner";
import ExposureFearSelector from "@/app/components/practice/exposures/ExposureFearSelector";
import ExposureSituations from "@/app/components/practice/exposures/ExposureSituations";
import ExposureTasksSection from "@/app/components/practice/exposures/ExposureTasksSection";
import {
  SavedFearSchema,
  type SavedFear,
} from "@/app/lib/zod/saved-fear-schema";

const SavedFearsResponseSchema = z.object({ fears: z.array(SavedFearSchema) });

export default function ExposuresCard() {
  const [fears, setFears] = useState<SavedFear[] | null>(null);
  const [selectedFearId, setSelectedFearId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const selectedFear = fears?.find((fear) => fear.id === selectedFearId);

  useEffect(() => {
    const controller = new AbortController();

    async function loadFears() {
      try {
        const response = await fetch("/api/fears", {
          signal: controller.signal,
        });

        if (!response.ok) {
          if (!controller.signal.aborted) {
            setError(
              response.status === 401
                ? "Please sign in to view your saved fears."
                : "We couldn’t load your saved fears. You can try again.",
            );
          }
          return;
        }

        const data = SavedFearsResponseSchema.parse(await response.json());
        if (!controller.signal.aborted) {
          setFears(data.fears);
          setError(null);
        }
      } catch {
        if (!controller.signal.aborted) {
          setError("We couldn’t load your saved fears. You can try again.");
        }
      } finally {
        if (!controller.signal.aborted) setIsRetrying(false);
      }
    }

    void loadFears();
    return () => controller.abort();
  }, [attempt]);

  return (
    <section
      aria-labelledby="exposures-heading"
      className="card-tall flex flex-col gap-5 rounded-xl border border-subtle bg-card p-4 sm:p-5"
    >
      <div className="shrink-0 space-y-1">
        <h2
          id="exposures-heading"
          className="text-sm font-semibold text-primary"
        >
          Exposure practice
        </h2>
      </div>

      <div className="modal-scrollbar -m-1 min-h-0 flex-1 overflow-y-auto p-1">
        {error ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <p role="alert" className="text-sm text-muted">
              {error}
            </p>

            <button
              type="button"
              disabled={isRetrying}
              aria-label={isRetrying ? "Loading saved fears" : "Try again"}
              aria-busy={isRetrying}
              onClick={() => {
                setIsRetrying(true);
                setAttempt((current) => current + 1);
              }}
              className="btn-accent flex h-9 min-w-24 cursor-pointer items-center justify-center px-3 text-xs disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isRetrying ? <LoadingSpinner /> : "Try again"}
            </button>
          </div>
        ) : fears === null ? (
          <ExposureFearSelectorLoader />
        ) : fears.length === 0 ? (
          <div className="space-y-1 text-sm text-muted">
            <p>No saved fears yet.</p>
            <p>
              Fears saved in <strong>Prepare</strong> will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            <ExposureFearSelector
              fears={fears}
              value={selectedFearId}
              onChange={({ fearId }) => setSelectedFearId(fearId)}
            />
            <AnimatePresence initial={false} mode="wait">
              {selectedFear && (
                <motion.div
                  key={selectedFear.id}
                  className="space-y-5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, pointerEvents: "none" }}
                >
                  <ExposureSituations
                    fearId={selectedFear.id}
                    fearName={selectedFear.name}
                  />
                  <HorizontalDivider />

                  <ExposureTasksSection
                    fearId={selectedFear.id}
                    fearName={selectedFear.name}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}
