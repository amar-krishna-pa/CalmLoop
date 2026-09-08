"use client";

import { cn } from "@/app/lib/cn/cn";
import LoadingSpinner from "@/app/components/loaders/LoadingSpinner";
import { LuTrash2, LuX } from "react-icons/lu";

interface Props {
  isDeleteMode: boolean;
  selectedCount: number;
  isDeleting: boolean;
  onEnterDeleteMode: () => void;
  onCancel: () => void;
  onDelete: () => void;
}

export default function SidebarDeleteControls({
  isDeleteMode,
  selectedCount,
  isDeleting,
  onEnterDeleteMode,
  onCancel,
  onDelete,
}: Props) {
  if (!isDeleteMode) {
    return (
      <button
        onClick={onEnterDeleteMode}
        className="flex items-center gap-2 w-full px-3 py-2 rounded-lg cursor-pointer text-sm font-medium border border-subtle text-danger transition-colors duration-150 hover:bg-danger/10"
      >
        <LuTrash2 size={13} />
        Delete chat history
      </button>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={onCancel}
        disabled={isDeleting}
        className="flex items-center justify-center gap-2 flex-1 px-3 py-2 rounded-lg cursor-pointer text-sm font-medium border border-subtle text-muted transition-colors duration-150 hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <LuX size={13} />
        Cancel
      </button>

      <button
        onClick={onDelete}
        disabled={selectedCount === 0 || isDeleting}
        className={cn(
          "flex items-center justify-center gap-2 flex-1 px-3 py-2 rounded-lg",
          "text-sm font-medium transition-colors duration-150",
          selectedCount === 0 || isDeleting
            ? "bg-danger/20 text-danger/50 cursor-not-allowed"
            : "bg-danger text-white cursor-pointer hover:opacity-90"
        )}
      >
        {isDeleting ? <LoadingSpinner size={14} /> : <LuTrash2 size={13} />}
        {isDeleting
          ? "Deleting…"
          : selectedCount === 0
          ? "Delete"
          : `Delete (${selectedCount})`}
      </button>
    </div>
  );
}
