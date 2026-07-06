import { Skeleton } from "./LoadingSkeleton";

const ROWS = [1, 2];

export default function FearHierarchyCardLoader() {
  return (
    <ul className="space-y-2 flex-1 min-h-0 overflow-hidden pr-2">
      {ROWS.map((row) => (
        <li
          key={row}
          className="p-3 rounded-lg bg-surface border border-subtle flex flex-col gap-2"
        >
          <Skeleton className="h-4 w-2/5" />

          <div className="flex items-center gap-2">
            <Skeleton className="h-2 flex-1 rounded-full" />
            <div className="h-5 w-5 shrink-0 opacity-0" />
          </div>

          <div className="flex items-center gap-2">
            <Skeleton className="h-2 flex-1 rounded-full" />
            <div className="h-5 w-5 shrink-0 opacity-0" />
          </div>
        </li>
      ))}
    </ul>
  );
}
