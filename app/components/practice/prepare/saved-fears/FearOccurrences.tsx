"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import {
  OccurrenceSchema,
  type Occurrence,
} from "@/app/lib/fears/occurrence-schema";
import FearOccurrencesLoader from "@/app/components/loaders/FearOccurrencesLoader";

const OccurrencesSchema = z.object({ occurrences: z.array(OccurrenceSchema) });

type Props = {
  fearId: string;
  onEdit: ({ occurrence }: { occurrence: Occurrence }) => void;
};

export default function FearOccurrences({ fearId, onEdit }: Props) {
  const [occurrences, setOccurrences] = useState<Occurrence[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadOccurrences() {
      try {
        const response = await fetch(`/api/fears/${fearId}/occurrences`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            response.status === 401
              ? "Please sign in again to load occurrences."
              : "Could not load occurrences. Please try again.",
          );
        }

        const data = OccurrencesSchema.parse(await response.json());
        if (!controller.signal.aborted) {
          setOccurrences(data.occurrences);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setError(
            error instanceof Error && error.message.startsWith("Please sign in")
              ? error.message
              : "Could not load occurrences. Please try again.",
          );
        }
      }
    }

    void loadOccurrences();

    return () => controller.abort();
  }, [fearId, attempt]);

  return (
    <section className="space-y-1" aria-label="Occurrences">
      <h3 className="text-xs font-medium text-primary">Occurrences</h3>

      {error ? (
        <div className="space-y-2">
          <p role="alert" className="text-sm text-muted">
            {error}
          </p>
          <button
            type="button"
            className="btn-accent cursor-pointer px-3 py-2"
            onClick={() => {
              setError(null);
              setAttempt((current) => current + 1);
            }}
          >
            Try again
          </button>
        </div>
      ) : occurrences === null ? (
        <FearOccurrencesLoader />
      ) : occurrences.length === 0 ? (
        <p className="text-sm text-muted">No occurrences found.</p>
      ) : (
        <ol className="space-y-5">
          {occurrences.map((occurrence) => (
            <li key={occurrence.id} className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <time
                  dateTime={occurrence.createdAt}
                  className="text-xs text-muted"
                >
                  {new Date(occurrence.createdAt).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </time>

                <button
                  type="button"
                  onClick={() => onEdit({ occurrence })}
                  aria-label="Edit occurrence"
                  className="shrink-0 cursor-pointer rounded-lg py-2 text-sm font-medium text-accent transition-opacity duration-fast hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  Edit
                </button>
              </div>

              <p className="whitespace-pre-wrap wrap-break-words text-sm text-primary">
                {occurrence.evidence}
              </p>

              <dl className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-muted">
                <div className="flex gap-1">
                  <dt>Initial distress:</dt>
                  <dd>{occurrence.initialSuds}/10</dd>
                </div>

                <p>|</p>

                <div className="flex gap-1">
                  <dt>Latest distress:</dt>
                  <dd>
                    {occurrence.currentSuds === null
                      ? "Not recorded"
                      : `${occurrence.currentSuds}/10`}
                  </dd>
                </div>
              </dl>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
