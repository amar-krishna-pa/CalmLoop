import type { Exposure } from "@/app/lib/zod/exposure-schema";

type Props = {
  exposure: Exposure;
};

export default function ExposureListItem({ exposure }: Props) {
  const themesLabel = exposure.themes.join(", ");
  const distressLabel =
    exposure.currentSuds === null
      ? `Initial ${exposure.initialSuds}/10`
      : `Initial ${exposure.initialSuds}/10 · Latest ${exposure.currentSuds}/10`;

  return (
    <article className="flex flex-col gap-3 rounded-xl bg-surface p-4">
      <div className="flex items-start justify-between gap-4">
        <span className="rounded-full border border-subtle bg-card px-2.5 py-1 text-xs font-medium text-muted">
          Available
        </span>

        <span className="shrink-0 text-xs font-medium text-primary">
          {distressLabel}
        </span>
      </div>

      <div className="min-w-0 flex flex-col">
        <h3 className="wrap-break-words text-sm font-semibold text-primary">
          {exposure.evidence}
        </h3>
        <p className="mt-2 wrap-break-words text-xs text-muted">
          Fear: {exposure.fearName}
        </p>
        {themesLabel && (
          <p className="mt-1 wrap-break-words text-xs text-muted">
            Themes: {themesLabel}
          </p>
        )}
      </div>

      <button
        type="button"
        className="btn-accent self-end px-3 py-1.5 text-xs disabled:cursor-not-allowed disabled:opacity-50"
        disabled
      >
        Work on this
      </button>
    </article>
  );
}
