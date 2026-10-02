import type { Exposure } from "@/app/lib/zod/exposure-schema";

type Props = {
  exposure: Exposure;
};

export default function ExposureListItem({ exposure }: Props) {
  return (
    <article className="flex flex-col gap-3 rounded-xl bg-surface p-4">
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
    </article>
  );
}
