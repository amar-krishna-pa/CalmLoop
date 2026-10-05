import type { ExposureTask } from "@/app/lib/zod/exposure-task-schema";

type Props = { tasks: ExposureTask[] };

export default function ExposureTasksList({ tasks }: Props) {
  return (
    <ul className="space-y-4">
      {tasks.map((task) => (
        <li key={task.id} className="space-y-2 rounded-lg bg-surface/50 p-3">
          <h4 className="whitespace-pre-wrap wrap-break-words text-sm font-medium text-primary">
            {task.action}
          </h4>
          <p className="text-xs text-muted">
            Expected distress: {task.expectedSuds}/10
          </p>
          <div className="space-y-1 text-xs text-muted">
            <p className="font-medium">Compulsions to avoid</p>
            {task.compulsionsToAvoid.length === 0 ? (
              <p>No compulsions added for this task.</p>
            ) : (
              <p className="whitespace-pre-wrap wrap-break-words">
                {task.compulsionsToAvoid.join("\n")}
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
