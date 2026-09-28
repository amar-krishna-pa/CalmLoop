import { LuChartLine } from "react-icons/lu";
import LoadingSpinner from "@/app/components/loaders/LoadingSpinner";
import type { ExposurePracticeStatus } from "@/app/constants/exposures/practice-statuses";
import type { Exposure } from "@/app/lib/zod/exposure-schema";
import { cn } from "@/app/lib/cn";

type Props = {
  exposure: Exposure;
  isUpdatingStatus: boolean;
  isStatusUpdatePending: boolean;
  onAddCheckIn: () => void;
  onStatusChange: ({
    exposureId,
    practiceStatus,
  }: {
    exposureId: string;
    practiceStatus: ExposurePracticeStatus;
  }) => void;
};

export default function ExposureListItem({
  exposure,
  isUpdatingStatus,
  isStatusUpdatePending,
  onAddCheckIn,
  onStatusChange,
}: Props) {
  const isInProgress = exposure.practiceStatus === "in_progress";

  return (
    <article className="flex flex-col gap-3 rounded-xl bg-surface p-4 sm:flex-row sm:items-stretch">
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <span
          className={cn(
            "self-start rounded-full border px-2.5 py-1 text-xs font-medium",
            isInProgress
              ? "border-accent bg-accent/10 text-accent"
              : "border-subtle bg-card text-muted",
          )}
        >
          {isInProgress ? "In progress" : "Available"}
        </span>

        <div className="min-w-0 flex flex-col">
          <h3 className="wrap-break-words text-sm font-semibold text-primary">
            {exposure.evidence}
          </h3>
          <p className="mt-2 wrap-break-words text-xs text-muted">
            {exposure.fearName}
          </p>
          <dl className="mt-3 flex flex-wrap gap-x-8 gap-y-2">
            <div className="flex items-baseline gap-2">
              <dt className="text-xs text-muted">Initial:</dt>
              <dd className="text-sm font-semibold text-primary">
                {exposure.initialSuds}/10
              </dd>
            </div>
            <div className="flex items-baseline gap-2">
              <dt className="text-xs text-muted">Latest:</dt>
              <dd className="text-sm font-semibold text-primary">
                {exposure.currentSuds === null
                  ? "Not recorded"
                  : `${exposure.currentSuds}/10`}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div
        className={cn(
          "flex flex-col gap-2 sm:w-44 sm:shrink-0",
          isInProgress ? "justify-between" : "justify-end",
        )}
      >
        {isInProgress ? (
          <>
            <button
              type="button"
              disabled
              className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-subtle px-3 py-1.5 text-xs font-medium text-muted transition-colors duration-fast hover:bg-card hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LuChartLine aria-hidden="true" size={14} />
              View progress
            </button>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                className="btn-accent w-full px-3 py-1.5 text-xs disabled:cursor-not-allowed disabled:opacity-50"
                onClick={onAddCheckIn}
              >
                Add check-in
              </button>
              <button
                type="button"
                aria-label={
                  isUpdatingStatus
                    ? "Moving situation to available"
                    : undefined
                }
                className="flex h-8 w-full cursor-pointer items-center justify-center rounded-lg border border-subtle px-3 text-xs font-medium text-muted transition-colors duration-fast hover:bg-card hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isStatusUpdatePending}
                onClick={() =>
                  onStatusChange({
                    exposureId: exposure.id,
                    practiceStatus: "available",
                  })
                }
              >
                {isUpdatingStatus ? (
                  <LoadingSpinner size={14} />
                ) : (
                  "Move to available"
                )}
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            aria-label={
              isUpdatingStatus ? "Moving situation to in progress" : undefined
            }
            className="btn-accent flex h-8 w-full cursor-pointer items-center justify-center px-3 py-0 text-xs disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isStatusUpdatePending}
            onClick={() =>
              onStatusChange({
                exposureId: exposure.id,
                practiceStatus: "in_progress",
              })
            }
          >
            {isUpdatingStatus ? (
              <LoadingSpinner size={14} />
            ) : (
              "Work on this"
            )}
          </button>
        )}
      </div>
    </article>
  );
}
