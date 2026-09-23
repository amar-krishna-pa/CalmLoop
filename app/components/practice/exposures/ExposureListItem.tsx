import type { Exposure } from "@/app/lib/zod/exposure-schema";

type Props = {
  exposure: Exposure;
};

export default function ExposureListItem({ exposure }: Props) {
  const distressLabel =
    exposure.currentSuds === null
      ? `Initial ${exposure.initialSuds}/10`
      : `Initial ${exposure.initialSuds}/10 · Latest ${exposure.currentSuds}/10`;

  return (
    <article className="rounded-xl bg-surface p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="wrap-break-words text-sm font-semibold text-primary">
            {exposure.evidence}
          </h3>
          <p className="mt-2 wrap-break-words text-xs text-muted">
            {exposure.fearName}
            {exposure.themes.length > 0
              ? ` · ${exposure.themes.join(", ")}`
              : ""}
          </p>
        </div>

        <span className="shrink-0 text-xs font-medium text-primary">
          {distressLabel}
        </span>
      </div>
    </article>
  );
}
