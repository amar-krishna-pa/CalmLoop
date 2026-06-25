"use client";

import { cn } from "@/app/lib/cn/cn";
import { useRouter } from "next/navigation";
import { LuPencil } from "react-icons/lu";
import ChatSessionItem from "./ChatSessionItem";
import { Dispatch, SetStateAction } from "react";

export interface SessionItem {
  id: string;
  createdAt: string;
  title: string;
}

interface Props {
  chatSessions: SessionItem[];
  setChatSessions: Dispatch<SetStateAction<SessionItem[]>>;
  currentSessionId: string;
}

export default function ChatSessionsSidebar({
  chatSessions,
  setChatSessions,
  currentSessionId,
}: Props) {
  const router = useRouter();

  function handleTitleSaved({
    chatSessionId,
    title,
  }: {
    chatSessionId: string;
    title: string;
  }) {
    setChatSessions((prev) =>
      prev.map((s) => (s.id === chatSessionId ? { ...s, title } : s))
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 shrink-0">
        <button
          onClick={() => router.push(`/chat/${crypto.randomUUID()}`)}
          className={cn(
            "flex items-center gap-2 w-full px-3 py-2 rounded-lg cursor-pointer",
            "text-sm font-medium text-primary bg-primary border border-subtle",
            "hover:bg-surface transition-colors duration-150"
          )}
        >
          <LuPencil size={13} />
          New session
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-3">
        {chatSessions.length === 0 && (
          <p className="text-xs text-muted text-center mt-8 px-3">
            No past sessions yet.
          </p>
        )}

        <ul className="space-y-0.5">
          {chatSessions.map((s) => (
            <li key={s.id}>
              <ChatSessionItem
                session={s}
                isActive={s.id === currentSessionId}
                onTitleSaved={handleTitleSaved}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
