import { Skeleton } from "@/app/components/loaders/LoadingSkeleton";

export default function ExposuresCardLoader() {
  return (
    <div role="status" className="space-y-3">
      <span className="sr-only">Loading practice situations</span>
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
    </div>
  );
}
