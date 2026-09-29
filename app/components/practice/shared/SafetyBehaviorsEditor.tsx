"use client";

import { LuPlus, LuTrash2 } from "react-icons/lu";
import type { PreviewBehavior } from "@/app/types/fears";
import { AnimatePresence, motion } from "motion/react";

type Props = {
  behaviors: PreviewBehavior[];
  onChange: ({ behaviors }: { behaviors: PreviewBehavior[] }) => void;
};

export default function SafetyBehaviorsEditor({
  behaviors,
  onChange,
}: Props) {
  function addBehavior() {
    onChange({
      behaviors: [...behaviors, { id: crypto.randomUUID(), value: "" }],
    });
  }

  function removeBehavior({ id }: { id: string }) {
    onChange({
      behaviors: behaviors.filter((behavior) => behavior.id !== id),
    });
  }

  function updateBehavior({ id, value }: { id: string; value: string }) {
    onChange({
      behaviors: behaviors.map((behavior) =>
        behavior.id === id ? { ...behavior, value } : behavior,
      ),
    });
  }

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-primary">
          Safety behaviors
        </span>
        <button
          type="button"
          onClick={addBehavior}
          className="inline-flex min-h-6 cursor-pointer items-center gap-1 text-2xs font-medium leading-none text-accent"
        >
          <LuPlus size={13} className="shrink-0" /> Add
        </button>
      </div>

      <p className="mb-2 text-xs text-muted">
        Things you do to feel more certain or reduce anxiety, such as repeated
        checking. You can leave this blank if none came up.
      </p>
      <div className="relative">
        <AnimatePresence initial={false} mode="popLayout">
          {behaviors.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="mb-2 flex h-10 items-center text-xs text-muted">
                No safety behaviors added yet
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="behaviors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AnimatePresence initial={false}>
                {behaviors.map((behavior, behaviorIndex) => (
                  <motion.div
                    key={behavior.id}
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
                        value={behavior.value}
                        onChange={(event) =>
                          updateBehavior({
                            id: behavior.id,
                            value: event.target.value,
                          })
                        }
                        maxLength={120}
                        aria-label={`Safety behavior ${behaviorIndex + 1}`}
                        className="input-base h-10 border-subtle/60 bg-modal/70"
                      />
                      <button
                        type="button"
                        onClick={() => removeBehavior({ id: behavior.id })}
                        aria-label={`Remove safety behavior ${behaviorIndex + 1}`}
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
