"use client";

import { useEffect } from "react";
import FearHierarchyCardLoader from "@/app/components/loaders/FearHierarchyCardLoader";
import {
  fetchFearHierarchyItems,
  useTreatmentStore,
} from "@/app/lib/stores/treatment";

export default function FearHierarchyList() {
  const items = useTreatmentStore((state) => state.fearHierarchyItems);

  useEffect(() => {
    fetchFearHierarchyItems();
  }, []);

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
          className="p-3 rounded-lg bg-surface border border-subtle flex flex-col gap-1"
        >
          <p className="text-sm text-primary">{item.situation}</p>
          <div className="flex gap-4">
            <span className="text-xs text-muted">
              Initial: {item.initialSuds}
            </span>
            <span className="text-xs text-muted">
              Current: {item.currentSuds}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
