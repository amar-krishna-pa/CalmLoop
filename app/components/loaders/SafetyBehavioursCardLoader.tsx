import { Skeleton } from "./LoadingSkeleton";

const ROWS = [1, 2, 3];

export default function SafetyBehavioursCardLoader() {
  return (
    <ul className="space-y-2">
      {ROWS.map((row) => (
        <li
          key={row}
          className="p-3 rounded-lg bg-surface border border-subtle space-y-1.5"
        >
          <div className="flex items-start justify-between gap-2">
            <Skeleton className="h-3.5 w-3/5" />
            <Skeleton className="h-4 w-16 rounded-full shrink-0" />
          </div>
          <Skeleton className="h-3 w-2/5" />
        </li>
      ))}
    </ul>
  );
}
