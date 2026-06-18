import { cn } from "@/app/utils/cn";

type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("skeleton rounded-md", className)} />
  );
}
