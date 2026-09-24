"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import ExposuresCardLoader from "@/app/components/loaders/ExposuresCardLoader";
import LoadingSpinner from "@/app/components/loaders/LoadingSpinner";
import ExposureListItem from "@/app/components/practice/exposures/ExposureListItem";
import { IN_PROGRESS_EXAMPLES } from "@/app/components/practice/exposures/in-progress-examples";
import { cn } from "@/app/lib/cn";
import {
  ExposuresResponseSchema,
  type Exposure,
} from "@/app/lib/zod/exposure-schema";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "inProgress", label: "In progress" },
  { value: "available", label: "Available" },
] as const;

type ExposureFilter = (typeof FILTERS)[number]["value"];

export default function ExposuresCard() {
  const [exposures, setExposures] = useState<Exposure[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<ExposureFilter>("all");

  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  const availableCount = exposures?.length ?? 0;
  const inProgressCount = IN_PROGRESS_EXAMPLES.length;
  const filterCounts: Record<ExposureFilter, number> = {
    all: availableCount + inProgressCount,
    inProgress: inProgressCount,
    available: availableCount,
  };
  const situationCountLabel = exposures
    ? `${availableCount} saved · ${inProgressCount} example${inProgressCount === 1 ? "" : "s"}`
    : null;
  const showInProgress = selectedFilter !== "available";
  const showAvailable = selectedFilter !== "inProgress";
  const visibleSituationCount = filterCounts[selectedFilter];

  function selectFilter({ filter }: { filter: ExposureFilter }) {
    setSelectedFilter(filter);
    scrollContainerRef.current?.scrollTo({ top: 0 });
  }

  return (
    <section
      aria-labelledby="exposures-heading"
      className="bg-card border border-subtle rounded-xl p-4 flex flex-col gap-4 card-medium"
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

      {!error && exposures !== null && filterCounts.all > 0 && (
        <div
          role="group"
          aria-label="Filter exposure situations"
          className="flex flex-wrap gap-2"
        >
          {FILTERS.map((filter) => {
            const isSelected = selectedFilter === filter.value;

            return (
              <button
                key={filter.value}
                type="button"
                aria-pressed={isSelected}
                onClick={() => selectFilter({ filter: filter.value })}
                className={cn(
                  "cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors duration-fast focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                  isSelected
                    ? "border-subtle bg-surface text-primary shadow-sm"
                    : "border-subtle text-muted hover:bg-surface hover:text-primary",
                )}
              >
                {filter.label} ({filterCounts[filter.value]})
              </button>
            );
          })}
        </div>
      )}

      <div
        ref={scrollContainerRef}
        aria-label="Exposure situations"
        role="region"
        tabIndex={exposures !== null && !error ? 0 : -1}
        className="flex-1 min-h-0 snap-y snap-mandatory scroll-py-2 overflow-y-auto pr-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
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
        ) : visibleSituationCount === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-1 text-center">
            <p className="text-sm font-medium text-primary">
              No {selectedFilter === "available" ? "available" : "practice"}{" "}
              situations yet
            </p>
            <p className="max-w-sm text-xs text-muted">
              {selectedFilter === "available" ? (
                <>
                  Situations saved in <strong>Prepare</strong> will appear here.
                </>
              ) : (
                "No situations match this filter."
              )}
            </p>
          </div>
        ) : (
          <ul className="relative space-y-3">
            <AnimatePresence initial={false} mode="popLayout">
              {showInProgress &&
                IN_PROGRESS_EXAMPLES.map((exposure) => (
                  <motion.li
                    layout="position"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={exposure.id}
                    className="snap-start"
                  >
                    <ExposureListItem exposure={exposure} status="inProgress" />
                  </motion.li>
                ))}
              {showAvailable &&
                exposures.map((exposure) => (
                  <motion.li
                    layout="position"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={exposure.id}
                    className="snap-start"
                  >
                    <ExposureListItem exposure={exposure} status="available" />
                  </motion.li>
                ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </section>
  );
}
