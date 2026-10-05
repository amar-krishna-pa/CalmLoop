import { Skeleton } from "@/app/components/loaders/LoadingSkeleton";

export default function ExposureTasksLoader() {
  return (
    <div role="status">
      <span className="sr-only">Loading tasks</span>
      <Skeleton className="h-5 w-64 max-w-full" />
    </div>
  );
}
