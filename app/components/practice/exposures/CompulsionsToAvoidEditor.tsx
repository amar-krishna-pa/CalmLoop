"use client";

import { AnimatePresence, motion } from "motion/react";
import { LuPlus, LuTrash2 } from "react-icons/lu";

export type CompulsionDraft = { id: string; value: string };

type Props = {
  compulsions: CompulsionDraft[];
  onChange: ({ compulsions }: { compulsions: CompulsionDraft[] }) => void;
};

export default function CompulsionsToAvoidEditor({
  compulsions,
  onChange,
}: Props) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h4 className="text-xs font-medium text-primary">
          Compulsions to avoid
        </h4>
        <button
          type="button"
          onClick={() =>
            onChange({
              compulsions: [
                ...compulsions,
                { id: crypto.randomUUID(), value: "" },
              ],
            })
          }
          className="inline-flex min-h-8 cursor-pointer items-center gap-1 text-xs text-accent"
        >
          <LuPlus size={14} aria-hidden="true" />
          Add compulsion
        </button>
      </div>

      <div className="relative">
        <AnimatePresence initial={false} mode="popLayout">
          {compulsions.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <p className="flex items-center text-xs text-muted">
                No compulsions added. Added compulsions will appear here.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AnimatePresence initial={false}>
                {compulsions.map((compulsion) => (
                  <motion.div
                    key={compulsion.id}
                    layout="position"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="-m-1 overflow-hidden"
                  >
                    <div className="space-y-1 p-1 pb-3">
                      <div className="flex items-center gap-2">
                        <input
                          id={compulsion.id}
                          value={compulsion.value}
                          maxLength={120}
                          onChange={(event) =>
                            onChange({
                              compulsions: compulsions.map((item) =>
                                item.id === compulsion.id
                                  ? { ...item, value: event.target.value }
                                  : item,
                              ),
                            })
                          }
                          className="input-base h-10"
                        />
                        <button
                          type="button"
                          aria-label="Remove compulsion"
                          onClick={() =>
                            onChange({
                              compulsions: compulsions.filter(
                                (item) => item.id !== compulsion.id,
                              ),
                            })
                          }
                          className="icon-btn h-10 w-10 shrink-0 cursor-pointer hover:border-danger hover:text-danger"
                        >
                          <LuTrash2 size={14} aria-hidden="true" />
                        </button>
                      </div>
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
