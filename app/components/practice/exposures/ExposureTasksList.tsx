import { AnimatePresence, motion } from "motion/react";
import type { ExposureTask } from "@/app/lib/zod/exposure-task-schema";
import RecordPracticeButton from "@/app/components/practice/exposures/RecordPracticeButton";
import PracticeHistoryButton from "@/app/components/practice/exposures/PracticeHistoryButton";

type Props = {
  tasks: ExposureTask[];
  onPracticeSaved: ({ exposureTaskId }: { exposureTaskId: string }) => void;
};

export default function ExposureTasksList({ tasks, onPracticeSaved }: Props) {
  return (
    <ol
      role="list"
      className="list-none space-y-4 [counter-reset:exposure-task]"
    >
      {tasks.map((task) => {
        const compulsionCounts = new Map<string, number>();

        return (
          <li
            key={task.id}
            className="space-y-3 rounded-xl border border-subtle bg-surface p-4 [counter-increment:exposure-task]"
          >
            <div className="min-w-0 space-y-2">
              <div className="min-w-0 space-y-1">
                <p
                  aria-hidden="true"
                  className="text-xs font-medium tabular-nums text-muted after:content-[counter(exposure-task)]"
                >
                  Task{" "}
                </p>
                <h4 className="whitespace-pre-wrap wrap-break-words text-base font-semibold leading-relaxed text-primary">
                  {task.action}
                </h4>
              </div>
              <dl className="flex flex-wrap items-baseline gap-x-2 text-xs text-muted">
                <dt>Expected distress</dt>
                <dd className="tabular-nums">{task.expectedSuds} / 10</dd>
              </dl>
            </div>
            <dl className="space-y-1.5 text-xs">
              <dt className="font-medium text-primary">Compulsions to avoid</dt>
              <dd className="text-muted">
                {task.compulsionsToAvoid.length === 0 ? (
                  <p>No compulsions added for this task.</p>
                ) : (
                  <ul className="list-disc space-y-1 pl-5">
                    {task.compulsionsToAvoid.map((compulsion) => {
                      const occurrence = compulsionCounts.get(compulsion) ?? 0;
                      compulsionCounts.set(compulsion, occurrence + 1);

                      return (
                        <li
                          key={JSON.stringify([
                            task.id,
                            compulsion,
                            occurrence,
                          ])}
                          className="whitespace-pre-wrap wrap-break-words"
                        >
                          {compulsion}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </dd>
            </dl>
            <div className="relative flex flex-wrap items-center gap-2">
              <RecordPracticeButton
                exposureTaskId={task.id}
                taskAction={task.action}
                onSaved={() => onPracticeSaved({ exposureTaskId: task.id })}
              />
              <AnimatePresence initial={false} mode="popLayout">
                {task.hasPracticeHistory && (
                  <motion.div
                    key="practice-history"
                    layout="position"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <PracticeHistoryButton
                      exposureTaskId={task.id}
                      taskAction={task.action}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
