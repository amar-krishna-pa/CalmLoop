import { Skeleton } from "./LoadingSkeleton";

const ROWS = [1, 2, 3];

export default function FearHierarchyCardLoader() {
  return (
    <div className="space-y-2 flex-1 min-h-0 overflow-hidden pr-2">
      {ROWS.map((row) => (
        <div
          key={row}
          className="flex flex-col gap-2 p-3 rounded-lg bg-surface border border-subtle"
        >
          <div className="flex items-start justify-between gap-2">
            <Skeleton className="h-3.5 w-3/4" />
            <Skeleton className="h-4 w-4 rounded shrink-0" />
          </div>

          <div className="flex items-center gap-2">
            <Skeleton className="h-2.5 w-10 shrink-0" />
            <Skeleton className="h-1.5 w-16 rounded-full" />
            <Skeleton className="h-2.5 w-4" />
          </div>
        </div>
      ))}
    </div>
  );
}
