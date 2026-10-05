"use client";

import { useRef, useState } from "react";
import { AnimatePresence } from "motion/react";
import Modal from "@/app/components/common/Modal";
import CreateExposureTaskForm from "@/app/components/practice/exposures/CreateExposureTaskForm";

type Props = { fearId: string; fearName: string; onSaved: () => void };

export default function CreateExposureTaskButton({
  fearId,
  fearName,
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
        className="btn-accent min-h-10 cursor-pointer px-4 text-xs"
      >
        Create task
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <Modal
            title="Create task"
            onClose={closeModal}
            size="large"
            fixedHeight
          >
            <CreateExposureTaskForm
              fearId={fearId}
              fearName={fearName}
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
