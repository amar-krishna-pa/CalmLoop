import { cn } from "@/app/lib/cn";

type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn("skeleton rounded-md", className)} />;
}
