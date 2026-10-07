"use client";

import { useRef, useState } from "react";
import { AnimatePresence } from "motion/react";
import Modal from "@/app/components/common/Modal";
import RecordPracticeForm from "@/app/components/practice/exposures/RecordPracticeForm";

type Props = {
  exposureTaskId: string;
  taskAction: string;
  onSaved: () => void;
};

export default function RecordPracticeButton({
  exposureTaskId,
  taskAction,
  onSaved,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const savingRef = useRef(false);

  function closeModal() {
    if (!savingRef.current) setIsOpen(false);
  }

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => setIsOpen(true)}
        className="min-h-10 cursor-pointer rounded-lg border border-accent px-4 text-xs font-medium text-accent transition-colors duration-fast hover:bg-accent/10"
      >
        Record practice
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <Modal title="Record practice" onClose={closeModal}>
            <RecordPracticeForm
              exposureTaskId={exposureTaskId}
              taskAction={taskAction}
              onCancel={closeModal}
              onSaved={() => {
                setIsOpen(false);
                onSaved();
              }}
              onSavingChange={({ isSaving }) => {
                savingRef.current = isSaving;
              }}
            />
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
