import { Skeleton } from "@/app/components/loaders/LoadingSkeleton";

export default function ExposureTasksLoader() {
  return (
    <div role="status" className="space-y-4">
      <span className="sr-only">Loading tasks</span>
      <div aria-hidden="true" className="space-y-4">
        {["first", "second", "third"].map((placeholder) => (
          <div
            key={placeholder}
            className="space-y-4 rounded-xl border border-subtle bg-surface p-4"
          >
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:justify-between sm:gap-6">
              <div className="w-full min-w-0 flex-1 space-y-1">
                <Skeleton className="h-5 w-14" />
                <Skeleton className="h-6 w-4/5" />
              </div>
              <div className="flex shrink-0 items-center gap-3 rounded-lg bg-card px-3 py-2 sm:flex-col sm:items-end sm:gap-1">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-7 w-12" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Skeleton className="h-5 w-40" />
              <div className="space-y-1">
                <div className="flex h-5 items-center gap-3 pl-1">
                  <Skeleton className="size-1.5 shrink-0 rounded-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <div className="flex h-5 items-center gap-3 pl-1">
                  <Skeleton className="size-1.5 shrink-0 rounded-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
