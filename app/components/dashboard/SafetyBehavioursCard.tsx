"use client";

import { useEffect } from "react";
import { LuRefreshCw } from "react-icons/lu";
import SafetyBehaviourForm from "@/app/components/treatment/SafetyBehaviourForm";
import SafetyBehavioursCardLoader from "@/app/components/loaders/SafetyBehavioursCardLoader";
import {
  useTreatmentStore,
  fetchSafetyBehaviours,
  type SafetyBehaviour,
} from "@/app/lib/stores/treatment";

const FREQUENCY_COLOR: Record<SafetyBehaviour["frequency"], string> = {
  Rarely: "bg-success/10 text-success border-success/20",
  Sometimes: "bg-warning-bg text-warning-text border-warning-border",
  Often: "bg-danger/10 text-danger border-danger/20",
  Always: "bg-danger/20 text-danger border-danger/30",
};

export default function SafetyBehavioursCard() {
  const entries = useTreatmentStore((state) => state.safetyBehaviours);
  const loading = useTreatmentStore((state) => state.safetyBehavioursLoading);
  const fetchError = useTreatmentStore(
    (state) => state.safetyBehavioursFetchError
  );

  useEffect(() => {
    fetchSafetyBehaviours();
  }, []);

  return (
    <div className="bg-card border border-subtle rounded-xl p-4 flex flex-col gap-4 card-tall">
      <div>
        <h2 className="text-sm font-semibold text-primary">Safety Behaviours</h2>
        <p className="text-xs text-muted mt-0.5">Subtle compulsions to work on dropping</p>
      </div>

      <SafetyBehaviourForm />

      <div className="flex-1 min-h-0 overflow-y-auto">
        {loading && <SafetyBehavioursCardLoader />}

        {!loading && fetchError && (
          <div className="flex flex-col items-center justify-center gap-3 border border-subtle rounded-lg h-full">
            <p className="text-sm text-muted">Failed to load entries</p>
            <button
              onClick={fetchSafetyBehaviours}
              className="btn-accent flex items-center gap-1.5 cursor-pointer"
            >
              <LuRefreshCw size={13} />
              Retry
            </button>
          </div>
        )}

        {!loading && !fetchError && entries?.length === 0 && (
          <p className="text-sm text-muted h-full flex justify-center items-center border border-subtle rounded-lg">
            No safety behaviours logged yet — add your first one above.
          </p>
        )}

        {!loading && !fetchError && entries && entries.length > 0 && (
          <ul className="space-y-2 mr-2">
            {entries.map((b) => (
              <li
                key={b.id}
                className="p-3 rounded-lg bg-surface border border-subtle space-y-1.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-primary leading-snug">
                    {b.behaviour}
                  </p>
                  <span
                    className={`shrink-0 text-[10px] font-medium border rounded-full px-2 py-0.5 ${FREQUENCY_COLOR[b.frequency]}`}
                  >
                    {b.frequency}
                  </span>
                </div>
                <p className="text-xs text-muted">{b.category}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
