import { Skeleton } from "@/app/components/loaders/LoadingSkeleton";

export default function SavedFearsThemeFilterLoader() {
  return (
    <div role="status" className="w-56 max-w-full">
      <span className="sr-only">Loading theme filter</span>
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
  );
}
