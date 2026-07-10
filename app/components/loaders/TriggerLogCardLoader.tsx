import { Skeleton } from "./LoadingSkeleton";

const ROWS = [1, 2, 3];

export default function TriggerLogCardLoader() {
  return (
    <ul className="space-y-2">
      {ROWS.map((row) => (
        <li
          key={row}
          className="flex gap-3 p-3 rounded-lg bg-surface border border-subtle"
        >
          <Skeleton className="w-2 h-2 rounded-full mt-1.5 shrink-0" />

          <div className="flex-1 min-w-0 space-y-2">
            <Skeleton className="h-3.5 w-4/5" />
            <Skeleton className="h-3 w-2/5" />
            <Skeleton className="h-2.5 w-1/5" />
          </div>
        </li>
      ))}
    </ul>
  );
}
