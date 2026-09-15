"use client";

import { useEffect, useState } from "react";

import ExposuresCardLoader from "@/app/components/loaders/ExposuresCardLoader";
import LoadingSpinner from "@/app/components/loaders/LoadingSpinner";
import {
  ExposuresResponseSchema,
  type Exposure,
} from "@/app/lib/zod/exposure-schema";

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

  return (
    <section
      aria-labelledby="exposures-heading"
      className="bg-card border border-subtle rounded-xl p-4 flex flex-col gap-4 card-medium"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2
            id="exposures-heading"
            className="text-sm font-semibold text-primary"
          >
            Exposure practice
          </h2>
          <p className="mt-1 text-xs text-muted">
            Exposures are situations you practise facing while leaving room for uncertainty.
          </p>
        </div>

          <span aria-live="polite" className="w-20 shrink-0 text-right text-xs text-muted">
            {exposures !== null ? `${exposures.length} ${exposures.length === 1 ? "item" : "items"}` : null}
          </span>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        {error ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <p role="alert" className="text-sm text-muted">
              {error}
            </p>
            <button
              type="button"
              className="btn-accent flex h-8 min-w-24 items-center justify-center px-4 py-0 cursor-pointer"
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
        ) : exposures.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-1 text-center">
            <p className="text-sm font-medium text-primary">
              No practice situations yet
            </p>
            <p className="max-w-sm text-xs text-muted">
              In <strong>Prepare</strong>, you can map out your triggers.
              Saved entries will appear here. One is enough to begin.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {exposures.map((exposure) => (
              <li key={exposure.id} className="rounded-lg bg-surface p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="wrap-break-words text-sm font-medium text-primary">
                      {exposure.fearName}
                    </p>
                    <p className="mt-1 wrap-break-words text-xs text-muted">
                      {exposure.evidence}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
                    {exposure.currentSuds ?? exposure.initialSuds}/10
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
