import { Skeleton } from "@/app/components/loaders/LoadingSkeleton";

export default function SavedFearsLoader() {
  return (
    <div role="status" className="space-y-3">
      <span className="sr-only">Loading saved fears</span>
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  );
}
