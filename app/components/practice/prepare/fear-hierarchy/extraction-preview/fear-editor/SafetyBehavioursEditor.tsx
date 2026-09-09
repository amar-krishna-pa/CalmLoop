"use client";

import { LuPlus, LuTrash2 } from "react-icons/lu";
import type { PreviewBehaviour } from "@/app/lib/fears/types";
import { AnimatePresence, motion } from "motion/react";

type Props = {
  behaviours: PreviewBehaviour[];
  onChange: ({ behaviours }: { behaviours: PreviewBehaviour[] }) => void;
};

export default function SafetyBehavioursEditor({
  behaviours,
  onChange,
}: Props) {
  function addBehaviour() {
    onChange({
      behaviours: [...behaviours, { id: crypto.randomUUID(), value: "" }],
    });
  }

  function removeBehaviour({ id }: { id: string }) {
    onChange({
      behaviours: behaviours.filter((behaviour) => behaviour.id !== id),
    });
  }

  function updateBehaviour({ id, value }: { id: string; value: string }) {
    onChange({
      behaviours: behaviours.map((behaviour) =>
        behaviour.id === id ? { ...behaviour, value } : behaviour,
      ),
    });
  }

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-primary">
          Safety behaviours
        </span>
        <button
          type="button"
          onClick={addBehaviour}
          className="inline-flex min-h-6 cursor-pointer items-center gap-1 text-2xs font-medium leading-none text-accent"
        >
          <LuPlus size={13} className="shrink-0" /> Add
        </button>
      </div>

      <div className="relative">
        <AnimatePresence initial={false} mode="popLayout">
          {behaviours.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="mb-2 flex h-10 items-center text-xs text-muted">
                No safety behaviours added
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="behaviours"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AnimatePresence initial={false}>
                {behaviours.map((behaviour, behaviourIndex) => (
                  <motion.div
                    key={behaviour.id}
                    initial={{
                      opacity: 0,
                      height: 0,
                    }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{
                      opacity: 0,
                      height: 0,
                    }}
                    className="-mx-0.5 overflow-hidden"
                  >
                    <div className="flex items-center gap-2 px-0.5 pt-0.5 pb-1.5">
                      <input
                        value={behaviour.value}
                        onChange={(event) =>
                          updateBehaviour({
                            id: behaviour.id,
                            value: event.target.value,
                          })
                        }
                        maxLength={120}
                        aria-label={`Safety behaviour ${behaviourIndex + 1}`}
                        className="input-base h-10 border-subtle/60 bg-modal/70"
                      />
                      <button
                        type="button"
                        onClick={() => removeBehaviour({ id: behaviour.id })}
                        aria-label={`Remove safety behaviour ${behaviourIndex + 1}`}
                        className="icon-btn h-auto w-10 shrink-0 self-stretch cursor-pointer hover:border-danger hover:text-danger"
                      >
                        <LuTrash2 size={14} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
