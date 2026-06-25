"use client";

import formatRelativeTime from "@/app/utils/formatRelativeTime";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { LuCheck, LuPencil, LuX } from "react-icons/lu";

export interface SessionItem {
  id: string;
  createdAt: string;
  title: string | null;
}

interface Props {
  sessions: SessionItem[];
  currentSessionId: string;
}

export default function ChatSessionsSidebar({
  sessions,
  currentSessionId,
}: Props) {
  const router = useRouter();
  const [localSessions, setLocalSessions] = useState(sessions);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function startEdit(s: SessionItem) {
    setEditingId(s.id);
    setEditValue(s.title ?? "");
    setTimeout(() => inputRef.current?.select(), 0);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditValue("");
  }

  async function commitEdit(id: string) {
    const trimmed = editValue.trim();
    if (!trimmed) {
      cancelEdit();
      return;
    }

    setLocalSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title: trimmed } : s))
    );
    setEditingId(null);

    await fetch(`/api/chat/chat-sessions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: trimmed }),
    });
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 shrink-0">
        <button
          onClick={() => router.push(`/chat/${crypto.randomUUID()}`)}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg cursor-pointer text-sm font-medium text-primary bg-primary border border-subtle hover:bg-surface transition-colors duration-150"
        >
          <LuPencil size={13} />
          New session
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-3">
        {localSessions.length === 0 && (
          <p className="text-xs text-muted text-center mt-8 px-3">
            No past sessions yet.
          </p>
        )}

        <ul className="space-y-0.5">
          {localSessions.map((s) => {
            const isActive = s.id === currentSessionId;
            const isEditing = s.id === editingId;

            return (
              <li key={s.id} className="group relative">
                {isEditing ? (
                  <div
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg ${
                      isActive
                        ? "bg-accent/10 border border-accent/20"
                        : "bg-surface"
                    }`}
                  >
                    <input
                      ref={inputRef}
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") commitEdit(s.id);
                        if (e.key === "Escape") cancelEdit();
                      }}
                      className="flex-1 text-sm bg-transparent outline-none text-primary min-w-0"
                      autoFocus
                    />
                    <button
                      onClick={() => commitEdit(s.id)}
                      className="shrink-0 text-muted hover:text-accent transition-colors"
                    >
                      <LuCheck size={14} />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="shrink-0 text-muted hover:text-primary transition-colors"
                    >
                      <LuX size={14} />
                    </button>
                  </div>
                ) : (
                  <Link
                    href={`/chat/${s.id}`}
                    className={`block px-3 py-2 rounded-lg transition-colors duration-150 ${
                      isActive
                        ? "bg-accent/10 border border-accent/20"
                        : "hover:bg-surface"
                    }`}
                  >
                    <p className="text-xs text-muted mb-0.5">
                      {formatRelativeTime(s.createdAt)}
                    </p>

                    <div className="flex items-center justify-between gap-1">
                      <p
                        className={`text-sm truncate ${
                          isActive ? "text-accent font-medium" : "text-primary"
                        }`}
                      >
                        {s.title ?? "Unnamed session"}
                      </p>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          startEdit(s);
                        }}
                        className="shrink-0 text-muted opacity-0 group-hover:opacity-100 hover:text-primary transition-all"
                      >
                        <LuPencil size={12} />
                      </button>
                    </div>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
