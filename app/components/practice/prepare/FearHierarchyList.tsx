"use client";

import { useEffect, useState } from "react";
import { LuCheck, LuPencil, LuRefreshCw, LuTrash2 } from "react-icons/lu";
import FearHierarchyCardLoader from "@/app/components/loaders/FearHierarchyCardLoader";
import LoadingSpinner from "@/app/components/loaders/LoadingSpinner";
import ConfirmOverlay from "@/app/components/common/ConfirmOverlay";
import {
  deleteFearHierarchyItem,
  fetchFearHierarchyItems,
  patchCurrentSuds,
  updateCurrentSudsState,
  useFearHierarchyStore,
} from "@/app/lib/stores/practice/fear-hierarchy";
import Slider from "@/app/components/common/Slider";

export default function FearHierarchyList() {
  const items = useFearHierarchyStore((state) => state.items);
  const loading = useFearHierarchyStore((state) => state.loading);
  const fetchError = useFearHierarchyStore((state) => state.fetchError);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchFearHierarchyItems();
  }, []);

  async function handleDoneEditing({
    id,
    currentSuds,
  }: {
    id: string;
    currentSuds: number;
  }) {
    setSavingId(id);

    const ok = await patchCurrentSuds({ id, currentSuds });

    setSavingId(null);

    if (ok) setEditingId(null);
  }

  async function handleDelete({ id }: { id: string }) {
    setDeletingId(id);

    const ok = await deleteFearHierarchyItem({ id });

    setDeletingId(null);
    if (ok) {
      setConfirmDeleteId(null);
    }
  }

  if (loading) return <FearHierarchyCardLoader />;

  if (fetchError) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 border border-subtle rounded-lg h-full">
        <p className="text-sm text-muted">Failed to load items</p>
        <button
          onClick={fetchFearHierarchyItems}
          className="btn-accent flex items-center gap-1.5 cursor-pointer"
        >
          <LuRefreshCw size={13} />
          Retry
        </button>
      </div>
    );
  }

  if (items?.length === 0) {
    return (
      <p className="text-sm text-muted h-full flex justify-center items-center border border-subtle rounded-lg">
        No items yet — add your first fear above.
      </p>
    );
  }

  return (
    <ul className="space-y-2 mr-2">
      {items?.map((item) => (
        <li
          key={item.id}
          className="relative p-3 rounded-lg bg-surface border border-subtle flex flex-col gap-2"
        >
          {confirmDeleteId === item.id && (
            <ConfirmOverlay
              message="Delete this item?"
              loading={deletingId === item.id}
              onConfirm={() => handleDelete({ id: item.id })}
              onCancel={() => setConfirmDeleteId(null)}
            />
          )}

          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-primary">{item.situation}</p>
            <button
              onClick={() => setConfirmDeleteId(item.id)}
              className="cursor-pointer p-1 rounded shrink-0 text-muted hover:text-danger hover:bg-danger/10 transition-colors"
              aria-label="Delete item"
            >
              <LuTrash2 size={12} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted w-10 shrink-0">
              Initial
            </span>
            <Slider
              value={item.initialSuds}
              editable={false}
              ariaLabel="Initial SUDS level"
            />
            <span className="text-xs text-muted w-4 shrink-0 text-right">
              {item.initialSuds}
            </span>
            <button
              className="p-1 rounded shrink-0 opacity-0 pointer-events-none"
              tabIndex={-1}
            >
              <LuPencil size={12} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted w-10 shrink-0">
              Current
            </span>
            <Slider
              value={item.currentSuds}
              editable={editingId === item.id}
              onChange={(value) =>
                updateCurrentSudsState({ id: item.id, currentSuds: value })
              }
              ariaLabel="Current SUDS level"
            />
            <span className="text-xs text-muted w-4 shrink-0 text-right">
              {item.currentSuds}
            </span>
            <button
              onClick={() =>
                editingId === item.id
                  ? handleDoneEditing({
                      id: item.id,
                      currentSuds: item.currentSuds,
                    })
                  : setEditingId(item.id)
              }
              disabled={savingId === item.id}
              className="cursor-pointer p-1 rounded shrink-0 text-muted hover:text-primary hover:bg-accent/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={
                editingId === item.id ? "Done editing" : "Edit current SUDS"
              }
            >
              {savingId === item.id ? (
                <LoadingSpinner size={12} />
              ) : editingId === item.id ? (
                <LuCheck size={12} />
              ) : (
                <LuPencil size={12} />
              )}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
