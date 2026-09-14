"use client";

import type { Occurrence } from "@/app/lib/zod/occurrence-schema";
import HorizontalDivider from "@/app/components/common/HorizontalDivider";
import FearOccurrences from "@/app/components/practice/prepare/saved-fears/FearOccurrences";

type Props = {
  fear: { id: string; name: string; themes: string[]; behaviours: string[] };
  onEdit: () => void;
  onEditOccurrence: ({ occurrence }: { occurrence: Occurrence }) => void;
};

export default function SavedFearDetails({ fear, onEdit, onEditOccurrence }: Props) {
  return (
    <div className="min-h-0 flex-1 space-y-4 overflow-y-auto">
      <div className="space-y-2">
        <section className="flex items-baseline gap-4" aria-label="Fear">
          <p className="min-w-0 flex-1 wrap-break-words text-sm text-muted">
            {fear.name}
          </p>
          <button
            type="button"
            aria-label="Edit fear"
            aria-haspopup="dialog"
            onClick={onEdit}
            className="-my-2 w-8 shrink-0 cursor-pointer rounded-lg py-2 text-center text-sm font-medium text-accent transition-opacity duration-fast hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Edit
          </button>
        </section>

        <section className="space-y-2" aria-label="Themes">
          {fear.themes.length === 0 ? (
            <p className="text-xs text-muted">No themes saved.</p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {fear.themes.map((theme) => (
                <li
                  key={theme}
                  className="rounded-full border-2 border-accent bg-modal px-3 py-1.5 text-xs text-primary"
                >
                  {theme}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <HorizontalDivider />

      <section className="space-y-2" aria-label="Safety behaviours">
        <h3 className="text-xs font-medium text-primary">
          Safety behaviours
        </h3>

        {fear.behaviours.length === 0 ? (
          <p className="text-xs text-muted">No safety behaviours saved.</p>
        ) : (
          <ul className="list-disc space-y-2 pl-4 text-sm text-muted">
            {Array.from(new Set(fear.behaviours)).map((behaviour) => (
              <li key={behaviour} className="wrap-break-words">
                {behaviour}
              </li>
            ))}
          </ul>
        )}
      </section>

      <HorizontalDivider />

      <FearOccurrences key={fear.id} fearId={fear.id} onEdit={onEditOccurrence} />
    </div>
  );
}
