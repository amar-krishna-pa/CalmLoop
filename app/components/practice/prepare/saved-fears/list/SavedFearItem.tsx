"use client";

import { LuTrash2 } from "react-icons/lu";
import type { SavedFear } from "@/app/lib/zod/saved-fear-schema";
import LoadingSpinner from "@/app/components/loaders/LoadingSpinner";

type Props = {
  fear: SavedFear;
  onOpen: () => void;
  onDelete: () => void;
  isDeleting: boolean;
};

export default function SavedFearItem({
  fear,
  onOpen,
  onDelete,
  isDeleting,
}: Props) {
  return (
    <div className="flex items-start gap-3 p-2">
      <div className="flex min-w-0 flex-1 flex-col items-start gap-2">
        <div className="w-full">
          <span className="wrap-break-words min-w-0 text-sm font-medium text-primary">
            {fear.name}
          </span>
        </div>
        {fear.themes.length > 0 && (
          <div aria-hidden="true" className="flex flex-wrap gap-2">
            {fear.themes.map((theme) => (
              <span
                key={theme}
                className="rounded-full border-2 border-accent bg-modal px-3 py-1.5 text-xs text-primary"
              >
                {theme}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          aria-haspopup="dialog"
          onClick={onOpen}
          className="cursor-pointer rounded-lg px-2 py-1.5 text-xs font-medium text-accent transition-opacity duration-fast hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          View
        </button>

        <button
          type="button"
          onClick={onDelete}
          disabled={isDeleting}
          aria-label={
            isDeleting ? `Deleting ${fear.name}` : `Delete ${fear.name}`
          }
          className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted transition-colors duration-fast hover:bg-danger/10 hover:text-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isDeleting ? <LoadingSpinner size={14} /> : <LuTrash2 size={14} />}
        </button>
      </div>
    </div>
  );
}
