"use client";

import type { Occurrence } from "@/app/lib/zod/occurrence-schema";
import HorizontalDivider from "@/app/components/common/HorizontalDivider";
import FearOccurrences from "@/app/components/practice/prepare/saved-fears/fear-dialog/occurrences/FearOccurrences";
import type { SavedFear } from "@/app/lib/zod/saved-fear-schema";

type Props = {
  fear: SavedFear;
  occurrences: Occurrence[] | null;
  onEdit: () => void;
  onEditOccurrence: ({ occurrence }: { occurrence: Occurrence }) => void;
  onOccurrencesLoaded: (occurrences: Occurrence[]) => void;
};

export default function SavedFearDetails({
  fear,
  occurrences,
  onEdit,
  onEditOccurrence,
  onOccurrencesLoaded,
}: Props) {
  return (
    <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-2">
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
            <p className="text-xs text-muted">
              No themes added yet. These are optional.
            </p>
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

      <FearOccurrences
        fearId={fear.id}
        occurrences={occurrences}
        onEdit={onEditOccurrence}
        onOccurrencesLoaded={onOccurrencesLoaded}
      />
    </div>
  );
}
