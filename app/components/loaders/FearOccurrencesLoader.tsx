import { Skeleton } from "@/app/components/loaders/LoadingSkeleton";

export default function FearOccurrencesLoader() {
  return (
    <div role="status" className="space-y-3">
      <span className="sr-only">Loading occurrences</span>
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
    </div>
  );
}
