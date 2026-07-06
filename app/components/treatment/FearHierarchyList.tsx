"use client";

import { useEffect, useState } from "react";
import { LuCheck, LuPencil } from "react-icons/lu";
import FearHierarchyCardLoader from "@/app/components/loaders/FearHierarchyCardLoader";
import {
  fetchFearHierarchyItems,
  patchCurrentSuds,
  updateCurrentSuds,
  useTreatmentStore,
} from "@/app/lib/stores/treatment";
import Slider from "@/app/components/common/Slider";

export default function FearHierarchyList() {
  const items = useTreatmentStore((state) => state.fearHierarchyItems);

  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchFearHierarchyItems();
  }, []);

  function handleDoneEditing({
    id,
    currentSuds,
  }: {
    id: string;
    currentSuds: number;
  }) {
    patchCurrentSuds({ id, currentSuds });

    setEditingId(null);
  }

  if (items === null) return <FearHierarchyCardLoader />;

  if (items.length === 0) {
    return (
      <p className="text-sm text-muted h-full flex justify-center items-center border border-subtle rounded-lg">
        No items yet — add your first fear above.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
          key={item.id}
          className="p-3 rounded-lg bg-surface border border-subtle flex flex-col gap-2"
        >
          <p className="text-sm text-primary">{item.situation}</p>

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
                updateCurrentSuds({ id: item.id, currentSuds: value })
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
              className="cursor-pointer p-1 rounded shrink-0 text-muted hover:text-primary hover:bg-accent/10 transition-colors"
              aria-label={
                editingId === item.id ? "Done editing" : "Edit current SUDS"
              }
            >
              {editingId === item.id ? (
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
