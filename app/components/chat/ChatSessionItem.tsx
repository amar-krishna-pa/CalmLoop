"use client";

import { cn } from "@/app/lib/cn/cn";
import formatRelativeTime from "@/app/utils/formatRelativeTime";
import Link from "next/link";
import { useRef, useState } from "react";
import { LuCheck, LuPencil, LuX } from "react-icons/lu";
import LoadingSpinner from "@/app/components/loaders/LoadingSpinner";
import type { SessionItem } from "@/app/lib/stores/chat";
import { useChatStore } from "@/app/lib/stores/chat";

type Props = {
  chatSession: SessionItem;
  isActive: boolean;
  isDeleteMode: boolean;
  isSelected: boolean;
  onToggleSelect: () => void;
};

export default function ChatSessionItem({
  chatSession,
  isActive,
  isDeleteMode,
  isSelected,
  onToggleSelect,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const updateSessionTitle = useChatStore((s) => s.updateSessionTitle);

  function startEdit() {
    setEditValue(chatSession.title ?? "");
    setIsEditing(true);
    setTimeout(() => inputRef.current?.select(), 0);
  }

  function cancelEdit() {
    setIsEditing(false);
    setEditValue("");
  }

  async function commitEdit() {
    const trimmed = editValue.trim();
    if (!trimmed) {
      cancelEdit();
      return;
    }

    setIsSaving(true);
    const response = await fetch(`/api/chat/chat-sessions/${chatSession.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: trimmed }),
    });
    setIsSaving(false);

    if (response.ok) {
      setIsEditing(false);
      updateSessionTitle({ chatSessionId: chatSession.id, title: trimmed });
    }
  }

  if (isEditing) {
    return (
      <div
        className={cn(
          "flex items-center gap-4 px-3 py-2 rounded-lg",
          isActive ? "bg-accent/10 border border-accent/20" : "bg-surface"
        )}
      >
        <input
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitEdit();
            if (e.key === "Escape") cancelEdit();
          }}
          className="flex-1 text-sm bg-transparent outline-none text-primary min-w-0"
          autoFocus
        />
        <button
          onClick={commitEdit}
          disabled={isSaving}
          className="shrink-0 text-muted hover:text-accent transition-colors cursor-pointer disabled:cursor-default"
        >
          {isSaving ? <LoadingSpinner size={14} /> : <LuCheck size={14} />}
        </button>
        <button
          onClick={cancelEdit}
          disabled={isSaving}
          className="shrink-0 text-muted hover:text-primary transition-colors cursor-pointer disabled:cursor-default"
        >
          <LuX size={14} />
        </button>
      </div>
    );
  }

  if (isDeleteMode) {
    return (
      <div
        role="button"
        onClick={onToggleSelect}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors duration-150",
          isSelected
            ? "bg-danger/10 border border-danger/20"
            : "hover:bg-surface"
        )}
      >
        <span
          className={cn(
            "shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors",
            isSelected ? "border-danger bg-danger" : "border-muted"
          )}
        >
          {isSelected && <LuCheck size={8} className="text-white" />}
        </span>

        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted mb-0.5">
            {formatRelativeTime(chatSession.createdAt)}
          </p>
          <p
            className={cn(
              "text-sm truncate",
              isSelected ? "text-danger font-medium" : "text-primary"
            )}
          >
            {chatSession.title ?? "Unnamed session"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={`/chat/${chatSession.id}`}
      className={cn(
        "group block px-3 py-2 rounded-lg transition-colors duration-150",
        isActive ? "bg-accent/10 border border-accent/20" : "hover:bg-surface"
      )}
    >
      <p className="text-xs text-muted mb-0.5">
        {formatRelativeTime(chatSession.createdAt)}
      </p>

      <div className="flex items-center justify-between gap-1">
        <p
          className={cn(
            "text-sm truncate",
            isActive ? "text-accent font-medium" : "text-primary"
          )}
        >
          {chatSession.title ?? "Unnamed chatSession"}
        </p>

        <button
          onClick={(e) => {
            e.preventDefault();
            startEdit();
          }}
          className="shrink-0 text-muted opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all cursor-pointer"
        >
          <LuPencil size={12} />
        </button>
      </div>
    </Link>
  );
}
