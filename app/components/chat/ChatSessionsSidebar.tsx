"use client";

import { useState } from "react";
import { cn } from "@/app/lib/cn/cn";
import ChatSessionsSidebarLoader from "@/app/components/loaders/ChatSessionsSidebarLoader";
import { useRouter } from "next/navigation";
import { LuPencil, LuTrash2, LuX } from "react-icons/lu";
import ChatSessionItem from "./ChatSessionItem";
import LoadingSpinner from "@/app/components/loaders/LoadingSpinner";

export interface SessionItem {
  id: string;
  createdAt: string;
  title: string;
}

interface Props {
  chatSessions: SessionItem[] | null;
  onTitleSaved: ({
    chatSessionId,
    title,
  }: {
    chatSessionId: string;
    title: string;
  }) => void;
  onSessionsDeleted: (ids: string[]) => void;
  currentSessionId: string;
}

export default function ChatSessionsSidebar({
  chatSessions,
  onTitleSaved,
  onSessionsDeleted,
  currentSessionId,
}: Props) {
  const router = useRouter();
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  }

  function cancelDeleteMode() {
    setIsDeleteMode(false);
    setSelectedIds(new Set());
  }

  async function deleteSelected() {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;

    setIsDeleting(true);
    try {
      const res = await fetch("/api/chat/chat-sessions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      if (res.ok) {
        onSessionsDeleted(ids);
        cancelDeleteMode();
      }
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-subtle shrink-0 h-14">
        <span className="text-sm font-semibold text-primary">Chat History</span>
      </div>

      <div className="p-3 space-y-1.5 shrink-0">
        <button
          onClick={() => router.push(`/chat/${crypto.randomUUID()}`)}
          disabled={isDeleteMode}
          className={cn(
            "flex items-center gap-2 w-full px-3 py-2 rounded-lg",
            "text-sm font-medium text-primary bg-primary border border-subtle",
            "transition-colors duration-150",
            isDeleteMode
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:bg-surface"
          )}
        >
          <LuPencil size={13} />
          New chat
        </button>

        {isDeleteMode ? (
          <div className="flex gap-2">
            <button
              onClick={cancelDeleteMode}
              disabled={isDeleting}
              className="flex items-center justify-center gap-2 flex-1 px-3 py-2 rounded-lg cursor-pointer text-sm font-medium border border-subtle text-muted transition-colors duration-150 hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LuX size={13} />
              Cancel
            </button>

            <button
              onClick={deleteSelected}
              disabled={selectedIds.size === 0 || isDeleting}
              className={cn(
                "flex items-center justify-center gap-2 flex-1 px-3 py-2 rounded-lg",
                "text-sm font-medium transition-colors duration-150",
                selectedIds.size === 0 || isDeleting
                  ? "bg-danger/20 text-danger/50 cursor-not-allowed"
                  : "bg-danger text-white cursor-pointer hover:opacity-90"
              )}
            >
              {isDeleting ? (
                <LoadingSpinner size={14} />
              ) : (
                <LuTrash2 size={13} />
              )}
              {isDeleting
                ? "Deleting…"
                : selectedIds.size === 0
                ? "Delete"
                : `Delete (${selectedIds.size})`}
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsDeleteMode(true)}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg cursor-pointer text-sm font-medium border border-subtle text-danger transition-colors duration-150 hover:bg-danger/10"
          >
            <LuTrash2 size={13} />
            Delete sessions
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-3">
        {chatSessions == null ? (
          <ChatSessionsSidebarLoader />
        ) : chatSessions.length === 0 ? (
          <p className="text-xs text-muted text-center mt-8 px-3">
            No past sessions yet.
          </p>
        ) : (
          <ul className="space-y-0.5">
            {chatSessions.map((s) => (
              <li key={s.id}>
                <ChatSessionItem
                  chatSession={s}
                  isActive={s.id === currentSessionId}
                  onTitleSaved={onTitleSaved}
                  isDeleteMode={isDeleteMode}
                  isSelected={selectedIds.has(s.id)}
                  onToggleSelect={() => toggleSelect(s.id)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
