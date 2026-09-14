import { Skeleton } from "@/app/components/loaders/LoadingSkeleton";

export default function PracticeTabsLoader() {
  return (
    <div role="status" aria-label="Loading practice tabs">
      <Skeleton className="h-16 w-full mb-6" />

      <div className="bg-card border border-subtle rounded-xl p-4 flex flex-col gap-4 card-medium">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="flex-1 w-full" />
      </div>
    </div>
  );
}
