import { Skeleton } from "./LoadingSkeleton";

const ROWS = [1, 2, 3];

export default function ErpTrackerCardLoader() {
  return (
    <ul className="space-y-2">
      {ROWS.map((row) => (
        <li
          key={row}
          className="p-3 rounded-lg bg-surface border border-subtle space-y-2"
        >
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-3.5 w-3/5" />
            <Skeleton className="h-3 w-1/6" />
          </div>
          <div className="flex gap-4">
            <div className="space-y-1.5">
              <Skeleton className="h-2.5 w-8" />
              <Skeleton className="h-2 w-20 rounded-full" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-2.5 w-8" />
              <Skeleton className="h-2 w-20 rounded-full" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
