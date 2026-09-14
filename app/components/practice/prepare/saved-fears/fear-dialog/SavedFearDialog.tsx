"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import EditOccurrenceForm from "@/app/components/practice/prepare/saved-fears/fear-dialog/occurrences/EditOccurrenceForm";
import type { Occurrence } from "@/app/lib/zod/occurrence-schema";
import Modal from "@/app/components/common/Modal";
import EditFearForm from "@/app/components/practice/prepare/saved-fears/fear-dialog/EditFearForm";
import SavedFearDetails from "@/app/components/practice/prepare/saved-fears/fear-dialog/SavedFearDetails";
import type { SavedFear } from "@/app/lib/zod/saved-fear-schema";

type Props = {
  fear: SavedFear;
  onClose: () => void;
  onSaved: ({ fear }: { fear: SavedFear }) => void;
};

export default function SavedFearDialog({ fear, onClose, onSaved }: Props) {
  const [view, setView] = useState<"details" | "edit" | "occurrence">("details");

  const [editingOccurrence, setEditingOccurrence] = useState<Occurrence | null>(null);

  const savingRef = useRef(false);

  return (
    <Modal
      title={view === "occurrence" ? "Edit occurrence" : view === "edit" ? "Edit fear" : "Fear details"}
      onClose={() => {
        if (savingRef.current) return;

        if (view !== "details") setView("details");
        else onClose();
      }}
      size="large"
      fixedHeight
    >
      <div className="relative flex min-h-0 flex-1 flex-col">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={view}
            tabIndex={-1}
            ref={(panel) => panel?.focus({ preventScroll: true })}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex min-h-0 w-full flex-1 flex-col outline-none"
          >
            {view === "edit" ? (
              <EditFearForm
                fear={fear}
                onDiscard={() => setView("details")}
                onSavingChange={({ isSaving }) => {
                  savingRef.current = isSaving;
                }}
                onSaved={({ fear: updated }) => {
                  onSaved({ fear: updated });
                  setView("details");
                }}
              />
            ) : view === "occurrence" && editingOccurrence ? (
              <EditOccurrenceForm
                key={editingOccurrence.id}
                occurrence={editingOccurrence}
                onDiscard={() => setView("details")}
              />
            ) : (
              <SavedFearDetails
                fear={fear}
                onEdit={() => setView("edit")}
                onEditOccurrence={({ occurrence }) => {
                  setEditingOccurrence(occurrence);
                  setView("occurrence");
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </Modal>
  );
}
