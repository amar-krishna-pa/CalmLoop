import { Skeleton } from "@/app/components/loaders/LoadingSkeleton";

export default function ExposureFearSelectorLoader() {
  return (
    <div role="status">
      <span className="sr-only">Loading saved fears</span>
      <Skeleton className="h-10 w-full" />
    </div>
  );
}
