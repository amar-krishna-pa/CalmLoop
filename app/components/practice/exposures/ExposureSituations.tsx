"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "motion/react";
import { LuHistory } from "react-icons/lu";
import { z } from "zod";
import HorizontalDivider from "@/app/components/common/HorizontalDivider";
import Modal from "@/app/components/common/Modal";
import FearOccurrencesLoader from "@/app/components/loaders/FearOccurrencesLoader";
import LoadingSpinner from "@/app/components/loaders/LoadingSpinner";
import {
  OccurrenceSchema,
  type Occurrence,
} from "@/app/lib/zod/occurrence-schema";

const OccurrencesResponseSchema = z.object({
  occurrences: z.array(OccurrenceSchema),
});

type Props = { fearId: string; fearName: string };

export default function ExposureSituations({ fearId, fearName }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [occurrences, setOccurrences] = useState<Occurrence[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    if (!isOpen || occurrences !== null) return;

    const controller = new AbortController();

    async function loadOccurrences() {
      try {
        const response = await fetch(`/api/fears/${fearId}/occurrences`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          if (!controller.signal.aborted) {
            setError(
              response.status === 401
                ? "Please sign in to view situations."
                : "We couldn’t load situations. You can try again.",
            );
          }
          return;
        }

        const data = OccurrencesResponseSchema.parse(await response.json());
        if (!controller.signal.aborted) {
          setOccurrences(data.occurrences);
          setError(null);
        }
      } catch {
        if (!controller.signal.aborted) {
          setError("We couldn’t load situations. You can try again.");
        }
      } finally {
        if (!controller.signal.aborted) setIsRetrying(false);
      }
    }

    void loadOccurrences();

    return () => controller.abort();
  }, [fearId, isOpen, occurrences, attempt]);

  return (
    <>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-haspopup="dialog"
          aria-describedby={`${fearId}-situations-description`}
          className="flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border border-accent px-3 py-2 text-xs font-medium text-primary transition-colors duration-fast hover:bg-accent/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <LuHistory
            size={15}
            aria-hidden="true"
            className="shrink-0 text-muted"
          />
          Review situations
        </button>
        <p id={`${fearId}-situations-description`} className="sr-only">
          {occurrences !== null &&
            `${occurrences.length} recorded ${occurrences.length === 1 ? "situation" : "situations"} · `}
          Distress and safety behaviors
        </p>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <Modal
            title="Review situations"
            onClose={() => setIsOpen(false)}
            size="large"
            fixedHeight="compact"
          >
            <p className="shrink-0 wrap-break-words text-sm text-muted">
              {fearName}
            </p>

            <HorizontalDivider />

            <div className="modal-scrollbar min-h-0 flex-1 overflow-y-auto pr-2">
              {error ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                  <p role="alert" className="text-sm text-muted">
                    {error}
                  </p>

                  <button
                    type="button"
                    disabled={isRetrying}
                    aria-label={isRetrying ? "Loading situations" : "Try again"}
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
              ) : occurrences === null ? (
                <FearOccurrencesLoader />
              ) : occurrences.length === 0 ? (
                <p className="text-xs text-muted">
                  No situations yet. Situations linked to this fear will appear
                  here.
                </p>
              ) : (
                <ol className="space-y-5">
                  {occurrences.map((occurrence) => {
                    const behaviors = [...new Set(occurrence.behaviors)];

                    return (
                      <li key={occurrence.id} className="space-y-2">
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-2xs text-muted">
                          <time dateTime={occurrence.createdAt}>
                            {new Date(occurrence.createdAt).toLocaleString(
                              undefined,
                              { dateStyle: "medium", timeStyle: "short" },
                            )}
                          </time>
                          <span>
                            Distress at the time: {occurrence.initialSuds}/10
                          </span>
                        </div>
                        <p className="whitespace-pre-wrap wrap-break-words text-sm text-primary">
                          {occurrence.evidence}
                        </p>
                        <div className="space-y-1 text-xs text-muted">
                          <h4 className="font-medium">Safety behaviors</h4>
                          {behaviors.length === 0 ? (
                            <p>
                              No safety behaviors recorded for this situation.
                            </p>
                          ) : (
                            <ul className="list-disc space-y-1 pl-4">
                              {behaviors.map((behavior) => (
                                <li key={behavior} className="wrap-break-words">
                                  {behavior}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              )}
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
