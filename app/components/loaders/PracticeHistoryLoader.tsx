import { Skeleton } from "@/app/components/loaders/LoadingSkeleton";

export default function PracticeHistoryLoader() {
  return (
    <div role="status" className="space-y-3">
      <span className="sr-only">Loading practice history</span>
      {["first", "second", "third"].map((placeholder) => (
        <div
          key={placeholder}
          aria-hidden="true"
          className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-modal-section p-3"
        >
          <Skeleton className="h-5 w-44 max-w-full" />
          <Skeleton className="h-5 w-52 max-w-full" />
        </div>
      ))}
    </div>
  );
}
