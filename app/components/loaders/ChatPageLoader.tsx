import { Skeleton } from "./LoadingSkeleton";

export default function ChatPageLoader() {
  return (
    <div className="flex flex-col h-full bg-primary">
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="flex justify-end">
            <Skeleton className="h-9 w-48 rounded-2xl" />
          </div>
          <div className="flex justify-start">
            <Skeleton className="h-16 w-64 rounded-2xl" />
          </div>
          <div className="flex justify-end">
            <Skeleton className="h-9 w-36 rounded-2xl" />
          </div>
          <div className="flex justify-start">
            <Skeleton className="h-24 w-72 rounded-2xl" />
          </div>
          <div className="flex justify-end">
            <Skeleton className="h-9 w-52 rounded-2xl" />
          </div>
          <div className="flex justify-start">
            <Skeleton className="h-12 w-60 rounded-2xl" />
          </div>
          <div className="flex justify-end">
            <Skeleton className="h-16 w-44 rounded-2xl" />
          </div>
          <div className="flex justify-start">
            <Skeleton className="h-20 w-80 rounded-2xl" />
          </div>
          <div className="flex justify-end">
            <Skeleton className="h-9 w-40 rounded-2xl" />
          </div>
          <div className="flex justify-start">
            <Skeleton className="h-16 w-56 rounded-2xl" />
          </div>
          <div className="flex justify-end">
            <Skeleton className="h-9 w-64 rounded-2xl" />
          </div>
        </div>
      </div>

      <div className="border-t border-subtle px-4 py-3">
        <div className="flex gap-2 items-center max-w-2xl mx-auto">
          <Skeleton className="h-9 flex-1 rounded-lg" />
          <Skeleton className="h-9 w-16 rounded-lg shrink-0" />
        </div>
      </div>
    </div>
  );
}
