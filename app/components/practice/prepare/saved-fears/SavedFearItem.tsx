"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { LuChevronRight } from "react-icons/lu";
import SavedFearModal from "@/app/components/practice/prepare/saved-fears/SavedFearModal";

type Props = {
  fear: { id: string; name: string; themes: string[]; behaviours: string[] };
};

export default function SavedFearItem({ fear }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => setIsOpen(true)}
        className="flex w-full flex-col items-start gap-2 rounded-lg p-2 text-left cursor-pointer hover:bg-accent/10 focus-visible:bg-accent/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <div className="flex w-full items-center justify-between gap-3">
          <span className="wrap-break-words min-w-0 text-sm font-medium text-primary">
            {fear.name}
          </span>
          <LuChevronRight aria-hidden="true" className="shrink-0 text-muted" />
        </div>
        {fear.themes.length > 0 && (
          <div aria-hidden="true" className="flex flex-wrap gap-2">
            {fear.themes.map((theme) => (
              <span
                key={theme}
                className="rounded-full border-2 border-accent bg-modal px-3 py-1.5 text-xs text-primary"
              >
                {theme}
              </span>
            ))}
          </div>
        )}
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <SavedFearModal
            key={fear.id}
            fear={fear}
            onClose={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
