"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";
import Modal from "@/app/components/common/Modal";
import PracticeHistory from "@/app/components/practice/exposures/PracticeHistory";

type Props = { exposureTaskId: string; taskAction: string };

export default function PracticeHistoryButton({
  exposureTaskId,
  taskAction,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => setIsOpen(true)}
        className="min-h-10 cursor-pointer rounded-lg border border-subtle px-4 text-xs font-medium text-primary transition-colors duration-fast hover:bg-accent/10"
      >
        Practice history
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <Modal
            title="Practice history"
            onClose={() => setIsOpen(false)}
            size="wide"
          >
            <PracticeHistory
              exposureTaskId={exposureTaskId}
              taskAction={taskAction}
            />
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
