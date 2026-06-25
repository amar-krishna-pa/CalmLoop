"use client";

import { cn } from "@/app/lib/cn/cn";
import ChatSessionsSidebarLoader from "@/app/components/loaders/ChatSessionsSidebarLoader";
import { useRouter } from "next/navigation";
import { LuPencil } from "react-icons/lu";
import ChatSessionItem from "./ChatSessionItem";
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
  currentSessionId: string;
}

export default function ChatSessionsSidebar({
  chatSessions,
  onTitleSaved,
  currentSessionId,
}: Props) {
  const router = useRouter();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-subtle shrink-0 h-14">
        <span className="text-sm font-semibold text-primary">Chat History</span>
      </div>

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
          New chat
        </button>
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
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
