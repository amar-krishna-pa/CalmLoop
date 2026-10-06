"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import HorizontalDivider from "@/app/components/common/HorizontalDivider";
import PracticeHistoryLoader from "@/app/components/loaders/PracticeHistoryLoader";
import LoadingSpinner from "@/app/components/loaders/LoadingSpinner";
import PracticeHistoryGraph from "@/app/components/practice/exposures/PracticeHistoryGraph";
import {
  PracticeAttemptSchema,
  type PracticeAttempt,
} from "@/app/lib/zod/practice-attempt-schema";

const AttemptsResponseSchema = z.object({
  attempts: z.array(PracticeAttemptSchema),
});
type Props = { exposureTaskId: string; taskAction: string };

export default function PracticeHistory({ exposureTaskId, taskAction }: Props) {
  const [attempts, setAttempts] = useState<PracticeAttempt[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadHistory() {
      try {
        const response = await fetch(
          `/api/exposure-tasks/${exposureTaskId}/attempts`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          if (!controller.signal.aborted) {
            setError(
              response.status === 401
                ? "Please sign in to view your practice history."
                : response.status === 404
                  ? "This task isn’t available. You can choose another task."
                  : "We couldn’t load your practice history. You can try again.",
            );
          }
          return;
        }

        const data = AttemptsResponseSchema.parse(await response.json());
        if (!controller.signal.aborted) {
          setAttempts(data.attempts);
          setError(null);
        }
      } catch {
        if (!controller.signal.aborted)
          setError(
            "We couldn’t load your practice history. You can try again.",
          );
      } finally {
        if (!controller.signal.aborted) setIsRetrying(false);
      }
    }

    void loadHistory();

    return () => controller.abort();
  }, [exposureTaskId, retry]);

  return (
    <div className="modal-scrollbar -m-1 min-h-0 flex-1 space-y-4 overflow-y-auto p-1">
      <dl className="space-y-1.5">
        <dt className="text-xs font-medium text-muted">Task action</dt>
        <dd className="whitespace-pre-wrap wrap-break-words text-sm text-primary">
          {taskAction}
        </dd>
      </dl>

      <HorizontalDivider />

      {error ? (
        <div className="flex flex-wrap items-center gap-3">
          <p role="alert" className="text-xs text-muted">
            {error}
          </p>

          <button
            type="button"
            disabled={isRetrying}
            aria-label={isRetrying ? "Loading practice history" : "Try again"}
            onClick={() => {
              setIsRetrying(true);
              setRetry((current) => current + 1);
            }}
            className="btn-accent flex min-h-9 min-w-24 cursor-pointer items-center justify-center px-3 text-xs disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isRetrying ? <LoadingSpinner /> : "Try again"}
          </button>
        </div>
      ) : attempts === null ? (
        <PracticeHistoryLoader />
      ) : attempts.length === 0 ? (
        <p className="text-xs text-muted">
          No practice attempts yet. Saved attempts for this task will appear
          here.
        </p>
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-stretch">
          <div className="min-w-0">
            <PracticeHistoryGraph attempts={attempts} />
          </div>

          <div className="lg:hidden">
            <HorizontalDivider />
          </div>

          <section
            aria-label="Practice attempts"
            className="relative min-w-0 lg:min-h-0"
          >
            <div className="flex flex-col gap-3 lg:absolute lg:inset-0">
              <h3 className="text-xs font-medium text-primary">
                Practice attempts
              </h3>

              <ol
                aria-label="Practice attempts, newest first"
                tabIndex={0}
                className="modal-scrollbar max-h-64 space-y-3 overflow-y-auto pr-3 focus-visible:outline-2 focus-visible:outline-accent lg:min-h-0 lg:max-h-none lg:flex-1"
              >
                {[...attempts].reverse().map((attempt) => (
                  <li
                    key={attempt.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-modal-section py-3 text-xs"
                  >
                    <time
                      dateTime={attempt.completedAt}
                      className="text-primary"
                    >
                      {new Date(attempt.completedAt).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </time>
                    <p className="text-muted">
                      After-practice distress:{" "}
                      <span className="font-medium tabular-nums text-primary">
                        {attempt.suds}/10
                      </span>
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
