"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { z } from "zod";
import ExposureTasksLoader from "@/app/components/loaders/ExposureTasksLoader";
import LoadingSpinner from "@/app/components/loaders/LoadingSpinner";
import CreateExposureTaskButton from "@/app/components/practice/exposures/CreateExposureTaskButton";
import ExposureTasksList from "@/app/components/practice/exposures/ExposureTasksList";
import {
  ExposureTaskSchema,
  type ExposureTask,
} from "@/app/lib/zod/exposure-task-schema";

const TasksResponseSchema = z.object({
  tasks: z.array(ExposureTaskSchema),
});

type Props = { fearId: string; fearName: string };

export default function ExposureTasksSection({ fearId, fearName }: Props) {
  const headingId = useId();

  const [tasks, setTasks] = useState<ExposureTask[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    controllerRef.current = controller;

    async function loadTasks() {
      try {
        const response = await fetch(`/api/fears/${fearId}/tasks`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          if (!controller.signal.aborted) {
            setError(
              response.status === 401
                ? "Please sign in to view your tasks."
                : response.status === 404
                  ? "This fear isn’t available. You can choose another saved fear."
                  : "We couldn’t load your tasks. You can try again.",
            );
          }
          return;
        }

        const data = TasksResponseSchema.parse(await response.json());

        if (!controller.signal.aborted) {
          setTasks(data.tasks);
          setError(null);
        }
      } catch {
        if (!controller.signal.aborted) {
          setError("We couldn’t load your tasks. You can try again.");
        }
      } finally {
        if (!controller.signal.aborted) setIsRetrying(false);
      }
    }

    void loadTasks();

    return () => controller.abort();
  }, [fearId, attempt]);

  return (
    <section aria-labelledby={headingId} className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 id={headingId} className="text-sm font-semibold text-primary">
          Tasks
        </h3>
        <CreateExposureTaskButton
          fearId={fearId}
          fearName={fearName}
          onSaved={() => {
            controllerRef.current?.abort();
            setTasks(null);
            setError(null);
            setIsRetrying(false);
            setAttempt((current) => current + 1);
          }}
        />
      </div>

      {error ? (
        <div className="flex flex-wrap items-center gap-3">
          <p role="alert" className="text-xs text-muted">
            {error}
          </p>

          <button
            type="button"
            disabled={isRetrying}
            aria-label={isRetrying ? "Loading tasks" : "Try again"}
            onClick={() => {
              setIsRetrying(true);
              setAttempt((current) => current + 1);
            }}
            className="btn-accent flex min-h-9 min-w-24 cursor-pointer items-center justify-center px-3 text-xs disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isRetrying ? <LoadingSpinner /> : "Try again"}
          </button>
        </div>
      ) : tasks === null ? (
        <ExposureTasksLoader />
      ) : (
        <AnimatePresence initial={false}>
          {tasks.length === 0 ? (
            <motion.p
              key="empty"
              initial={false}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs text-muted"
            >
              No tasks saved for this fear yet.
            </motion.p>
          ) : (
            <ExposureTasksList
              key="list"
              tasks={tasks}
              onPracticeSaved={({ exposureTaskId }) => {
                setTasks(
                  (current) =>
                    current?.map((task) =>
                      task.id === exposureTaskId
                        ? { ...task, hasPracticeHistory: true }
                        : task,
                    ) ?? null,
                );
              }}
            />
          )}
        </AnimatePresence>
      )}
    </section>
  );
}
