"use client";

import { useEffect, useState } from "react";
import { LuRefreshCw, LuTrash2 } from "react-icons/lu";
import ErpSessionForm from "@/app/components/treatment/practice/ErpSessionForm";
import ErpTrackerCardLoader from "@/app/components/loaders/ErpTrackerCardLoader";
import ConfirmOverlay from "@/app/components/common/ConfirmOverlay";
import AnxietyBar from "@/app/components/common/AnxietyBar";
import formatRelativeTime from "@/app/utils/formatRelativeTime";
import {
  deleteErpSession,
  fetchErpSessions,
  useErpSessionStore,
} from "@/app/lib/stores/treatment/erp-session";


export default function ErpTrackerCard() {
  const sessions = useErpSessionStore((state) => state.sessions);
  const loading = useErpSessionStore((state) => state.loading);
  const fetchError = useErpSessionStore((state) => state.fetchError);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchErpSessions();
  }, []);

  async function handleDelete({ id }: { id: string }) {
    setDeletingId(id);

    const ok = await deleteErpSession({ id });

    setDeletingId(null);
    if (ok) setConfirmDeleteId(null);
  }

  return (
    <div className="bg-card border border-subtle rounded-xl p-4 flex flex-col gap-4 card-tall">
      <div>
        <h2 className="text-sm font-semibold text-primary">ERP Tracker</h2>
        <p className="text-xs text-muted mt-0.5">
          Log exposure exercises and track anxiety reduction
        </p>
      </div>

      <ErpSessionForm />

      <div className="flex-1 min-h-0 overflow-y-auto">
        {loading && <ErpTrackerCardLoader />}

        {!loading && fetchError && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 border border-subtle rounded-lg h-full">
            <p className="text-sm text-muted">Failed to load sessions</p>
            <button
              onClick={fetchErpSessions}
              className="btn-accent flex items-center gap-1.5 cursor-pointer"
            >
              <LuRefreshCw size={13} />
              Retry
            </button>
          </div>
        )}

        {!loading && !fetchError && sessions?.length === 0 && (
          <p className="text-sm text-muted h-full flex justify-center items-center border border-subtle rounded-lg">
            No sessions logged yet — add your first one above.
          </p>
        )}

        {!loading && !fetchError && sessions && sessions.length > 0 && (
          <ul className="space-y-2 mr-2">
            {sessions.map((s) => (
              <li
                key={s.id}
                className="relative p-3 rounded-lg bg-surface border border-subtle space-y-2"
              >
                {confirmDeleteId === s.id && (
                  <ConfirmOverlay
                    message="Delete this session?"
                    loading={deletingId === s.id}
                    onConfirm={() => handleDelete({ id: s.id })}
                    onCancel={() => setConfirmDeleteId(null)}
                  />
                )}

                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-primary leading-snug">
                    {s.trigger}
                  </p>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] text-muted">
                      {formatRelativeTime(s.createdAt)}
                    </span>

                    <button
                      onClick={() => setConfirmDeleteId(s.id)}
                      className="cursor-pointer p-1 rounded text-muted hover:text-danger hover:bg-danger/10 transition-colors"
                      aria-label="Delete session"
                    >
                      <LuTrash2 size={12} />
                    </button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div>
                    <p className="text-[10px] text-muted mb-1">Before</p>
                    <AnxietyBar value={s.anxietyBefore} />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted mb-1">After</p>
                    <AnxietyBar value={s.anxietyAfter} />
                  </div>
                </div>

                {s.notes && <p className="text-xs text-muted">{s.notes}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
