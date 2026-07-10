"use client";

import { useEffect } from "react";
import { LuRefreshCw } from "react-icons/lu";
import TriggerLogForm from "@/app/components/treatment/TriggerLogForm";
import TriggerLogCardLoader from "@/app/components/loaders/TriggerLogCardLoader";
import AnxietyDot from "@/app/components/dashboard/AnxietyDot";
import formatRelativeTime from "@/app/utils/formatRelativeTime";
import {
  fetchTriggerLogEntries,
  useTreatmentStore,
} from "@/app/lib/stores/treatment";

export default function TriggerLogCard() {
  const entries = useTreatmentStore((state) => state.triggerLogEntries);
  const loading = useTreatmentStore((state) => state.triggerLogLoading);
  const fetchError = useTreatmentStore((state) => state.triggerLogFetchError);

  useEffect(() => {
    fetchTriggerLogEntries();
  }, []);

  return (
    <div className="bg-card border border-subtle rounded-xl p-4 flex flex-col gap-4 card-tall">
      <div>
        <h2 className="text-sm font-semibold text-primary">Trigger Log</h2>
        <p className="text-xs text-muted mt-0.5">
          Track what sets off your OCD
        </p>
      </div>

      <TriggerLogForm />

      <div className="flex-1 min-h-0 overflow-y-auto">
        {loading && <TriggerLogCardLoader />}

        {!loading && fetchError && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 border border-subtle rounded-lg h-full">
            <p className="text-sm text-muted">Failed to load entries</p>
            <button
              onClick={fetchTriggerLogEntries}
              className="btn-accent flex items-center gap-1.5 cursor-pointer"
            >
              <LuRefreshCw size={13} />
              Retry
            </button>
          </div>
        )}

        {!loading && !fetchError && entries?.length === 0 && (
          <p className="text-sm text-muted h-full flex justify-center items-center border border-subtle rounded-lg">
            No triggers logged yet — add your first one above.
          </p>
        )}

        {!loading && !fetchError && entries && entries.length > 0 && (
          <ul className="space-y-2 mr-2">
            {entries.map((e) => (
              <li
                key={e.id}
                className="flex gap-3 p-3 rounded-lg bg-surface border border-subtle"
              >
                <AnxietyDot level={e.anxietyLevel} />

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-primary leading-snug">
                      {e.trigger}
                    </p>
                    <span className="text-xs text-muted shrink-0">
                      {e.anxietyLevel}/10
                    </span>
                  </div>

                  <p className="text-xs text-muted">{e.context}</p>

                  <p className="text-[10px] text-muted">
                    {formatRelativeTime(e.createdAt)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
