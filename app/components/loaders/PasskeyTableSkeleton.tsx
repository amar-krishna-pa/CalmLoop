import { Skeleton } from "../common/LoadingSkeleton";

const widths = [
  { name: "w-28", date: "w-20" },
  { name: "w-24", date: "w-16" },
];

export default function PasskeyTableSkeleton() {
  return (
    <>
      {widths.map((w, i) => (
        <div key={i} className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-[18px] w-[18px] rounded-sm shrink-0" />
            <div className="flex flex-col gap-1.5">
              <Skeleton className={`h-3.5 ${w.name}`} />
              <Skeleton className={`h-3 ${w.date}`} />
            </div>
          </div>
          <Skeleton className="h-7 w-7 rounded-lg shrink-0" />
        </div>
      ))}
    </>
  );
}
