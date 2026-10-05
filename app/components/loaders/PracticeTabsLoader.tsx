import { Skeleton } from "@/app/components/loaders/LoadingSkeleton";
import { cn } from "@/app/lib/cn";

export default function PracticeTabsLoader({ tab }: { tab?: string }) {
  const isPrepare = tab !== "exposures" && tab !== "maintain";
  const fillsHeight = isPrepare || tab === "exposures";

  return (
    <div
      role="status"
      aria-label="Loading practice tabs"
      className={cn(
        fillsHeight && "flex min-h-0 flex-1 flex-col overflow-hidden",
      )}
    >
      <Skeleton className="mb-6 h-16 w-full shrink-0 sm:h-20" />

      <div
        className={cn(
          "gap-4",
          fillsHeight ? "flex min-h-0 flex-1 flex-col" : "grid lg:grid-cols-2",
        )}
      >
        {isPrepare && (
          <div className="bg-card border border-subtle rounded-xl p-4 flex min-h-0 max-h-[45%] shrink-0 flex-col gap-4 card-short">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="flex-1 w-full" />
          </div>
        )}
        <div
          className={cn(
            "card-medium flex flex-col gap-4 rounded-xl border border-subtle bg-card p-4",
            fillsHeight && "practice-card-height flex-1",
          )}
        >
          <Skeleton className="h-5 w-32" />
          <Skeleton className="flex-1 w-full" />
        </div>
        {tab === "maintain" && (
          <div className="bg-card border border-subtle rounded-xl p-4 flex flex-col gap-4 card-medium">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="flex-1 w-full" />
          </div>
        )}
      </div>
    </div>
  );
}
