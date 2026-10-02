"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import ExposuresCardLoader from "@/app/components/loaders/ExposuresCardLoader";
import LoadingSpinner from "@/app/components/loaders/LoadingSpinner";
import ExposureListItem from "@/app/components/practice/exposures/ExposureListItem";
import {
  ExposuresResponseSchema,
  type Exposure,
} from "@/app/lib/zod/exposure-schema";

function getEffectiveSuds(exposure: Exposure) {
  return exposure.currentSuds ?? exposure.initialSuds;
}

function sortByEffectiveSuds(exposures: Exposure[]) {
  return [...exposures].sort(
    (left, right) => getEffectiveSuds(left) - getEffectiveSuds(right),
  );
}

export default function ExposuresCard() {
  const [exposures, setExposures] = useState<Exposure[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadExposures() {
      try {
        const response = await fetch("/api/exposures", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            response.status === 401
              ? "Please sign in to view your practice situations."
              : "We couldn’t load your practice situations. You can try again.",
          );
        }

        const data = ExposuresResponseSchema.parse(await response.json());

        if (!controller.signal.aborted) {
          setExposures(data.exposures);
          setError(null);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setError(
            error instanceof Error && error.message.startsWith("Please sign in")
              ? error.message
              : "We couldn’t load your practice situations. You can try again.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsRetrying(false);
        }
      }
    }

    void loadExposures();

    return () => controller.abort();
  }, [attempt]);

  const sortedExposures = sortByEffectiveSuds(exposures ?? []);
  const totalCount = exposures?.length ?? 0;
  const situationCountLabel = exposures
    ? `${totalCount} ${totalCount === 1 ? "situation" : "situations"}`
    : null;

  return (
    <section
      aria-labelledby="exposures-heading"
      className="card-medium exposures-card-height flex flex-col gap-4 rounded-xl border border-subtle bg-card p-4"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h2
            id="exposures-heading"
            className="text-sm font-semibold text-primary"
          >
            Exposure practice
          </h2>
          <p className="mt-1 text-xs text-muted">
            Situations you have recorded for possible practice.
          </p>
        </div>
        <span
          aria-live="polite"
          className="text-xs text-muted sm:shrink-0 sm:text-right"
        >
          {!error && situationCountLabel}
        </span>
      </div>

      <div
        aria-label="Exposure situations"
        role="region"
        tabIndex={exposures !== null && !error ? 0 : -1}
        className="min-h-0 flex-1 snap-y snap-mandatory scroll-p-1 overflow-y-auto p-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {error ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <p role="alert" className="text-sm text-muted">
              {error}
            </p>
            <button
              type="button"
              className="btn-accent flex h-8 min-w-24 cursor-pointer items-center justify-center px-4 py-0"
              disabled={isRetrying}
              onClick={() => {
                setIsRetrying(true);
                setAttempt((current) => current + 1);
              }}
            >
              {isRetrying ? <LoadingSpinner /> : "Try again"}
            </button>
          </div>
        ) : exposures === null ? (
          <ExposuresCardLoader />
        ) : totalCount === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-1 text-center">
            <p className="text-sm font-medium text-primary">
              No practice situations yet
            </p>
            <p className="max-w-sm text-xs text-muted">
              Situations saved in <strong>Prepare</strong> will appear here.
            </p>
          </div>
        ) : (
          <ul className="relative space-y-3">
            <AnimatePresence initial={false} mode="popLayout">
              {sortedExposures.map((exposure) => (
                <motion.li
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  key={exposure.id}
                  className="snap-start rounded-xl"
                >
                  <ExposureListItem exposure={exposure} />
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </section>
  );
}
