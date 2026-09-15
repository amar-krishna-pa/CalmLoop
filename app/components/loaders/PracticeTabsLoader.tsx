import { Skeleton } from "@/app/components/loaders/LoadingSkeleton";
import { cn } from "@/app/lib/cn";

export default function PracticeTabsLoader({ tab }: { tab?: string }) {
  const isPrepare = tab !== "exposures" && tab !== "maintain";
  return (
    <div role="status" aria-label="Loading practice tabs">
      <Skeleton className="h-16 sm:h-20 w-full mb-6" />

      <div className={cn("grid gap-4", tab === "maintain" && "lg:grid-cols-2")}>
        {isPrepare && (
          <div className="bg-card border border-subtle rounded-xl p-4 flex flex-col gap-4 card-short">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="flex-1 w-full" />
          </div>
        )}
        <div className="bg-card border border-subtle rounded-xl p-4 flex flex-col gap-4 card-medium">
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
