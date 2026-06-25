import { Skeleton } from "./LoadingSkeleton";

export default function ChatSessionsSidebarLoader() {
  return (
    <ul className="space-y-0.5 mt-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <li key={i} className="px-3 py-2 space-y-1.5">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-4 w-full" />
        </li>
      ))}
    </ul>
  );
}
