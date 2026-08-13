"use client";

import { useEffect, useState } from "react";
import { LuRefreshCw, LuTrash2 } from "react-icons/lu";
import TriggerLogForm from "@/app/components/treatment/TriggerLogForm";
import TriggerLogCardLoader from "@/app/components/loaders/TriggerLogCardLoader";
import AnxietyDot from "@/app/components/dashboard/AnxietyDot";
import ConfirmOverlay from "@/app/components/common/ConfirmOverlay";
import formatRelativeTime from "@/app/utils/formatRelativeTime";
import {
  deleteTriggerLogEntry,
  fetchTriggerLogEntries,
  useTriggerLogStore,
} from "@/app/lib/stores/treatment/trigger-log";

export default function TriggerLogCard() {
  const entries = useTriggerLogStore((state) => state.entries);
  const loading = useTriggerLogStore((state) => state.loading);
  const fetchError = useTriggerLogStore((state) => state.fetchError);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchTriggerLogEntries();
  }, []);

  async function handleDelete({ id }: { id: string }) {
    setDeletingId(id);

    const ok = await deleteTriggerLogEntry({ id });

    setDeletingId(null);
    if (ok) setConfirmDeleteId(null);
  }

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
                className="relative flex gap-3 p-3 rounded-lg bg-surface border border-subtle"
              >
                {confirmDeleteId === e.id && (
                  <ConfirmOverlay
                    message="Delete this entry?"
                    loading={deletingId === e.id}
                    onConfirm={() => handleDelete({ id: e.id })}
                    onCancel={() => setConfirmDeleteId(null)}
                  />
                )}

                <AnxietyDot level={e.anxietyLevel} />

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-primary leading-snug">
                      {e.trigger}
                    </p>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-muted">
                        {e.anxietyLevel}/10
                      </span>

                      <button
                        onClick={() => setConfirmDeleteId(e.id)}
                        className="cursor-pointer p-1 rounded text-muted hover:text-danger hover:bg-danger/10 transition-colors"
                        aria-label="Delete entry"
                      >
                        <LuTrash2 size={12} />
                      </button>
                    </div>
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
