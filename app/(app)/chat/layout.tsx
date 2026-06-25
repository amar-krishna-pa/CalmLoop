"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { LuMenu } from "react-icons/lu";
import ChatSessionsSidebar, {
  type SessionItem,
} from "@/app/components/chat/ChatSessionsSidebar";
import { cn } from "@/app/lib/cn/cn";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [chatSessions, setChatSessions] = useState<SessionItem[] | null>(null);

  const { chatSessionId } = useParams<{ chatSessionId: string }>();

  useEffect(() => {
    async function fetchSessions() {
      try {
        const res = await fetch("/api/chat/chat-sessions");
        if (!res.ok) return;
        const data = await res.json();
        setChatSessions(data.sessions ?? []);
      } catch {
        // silent — sidebar just shows empty
      }
    }

    fetchSessions();
  }, [chatSessionId]);

  return (
    <div className="flex h-full">
      <aside
        className={cn(
          "flex flex-col bg-surface border-r border-subtle z-40",
          "fixed md:relative inset-y-0 left-0 w-64",
          "transition-transform md:transition-[width] duration-200",
          isOpen
            ? "translate-x-0 md:w-64"
            : "-translate-x-full md:w-0 md:overflow-hidden"
        )}
      >
        <ChatSessionsSidebar
          chatSessions={chatSessions}
          onTitleSaved={({ chatSessionId, title }) =>
            setChatSessions(
              (prev) =>
                prev?.map((s) =>
                  s.id === chatSessionId ? { ...s, title } : s
                ) ?? prev
            )
          }
          currentSessionId={chatSessionId}
        />
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className="flex-1 min-w-0 relative">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="absolute top-3 left-3 z-10 icon-btn cursor-pointer"
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        >
          <LuMenu size={14} />
        </button>

        {children}
      </div>
    </div>
  );
}
