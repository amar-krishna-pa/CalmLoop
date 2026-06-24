"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LuMenu, LuX } from "react-icons/lu";
import SessionsSidebar, { type SessionItem } from "./SessionsSidebar";
import { cn } from "@/app/lib/cn/cn";

interface Props {
  children: React.ReactNode;
}

export default function ChatLayout({ children }: Props) {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [sessions, setSessions] = useState<SessionItem[]>([]);

  const currentSessionId = pathname.startsWith("/chat/")
    ? pathname.slice("/chat/".length)
    : "";

  useEffect(() => {
    if (window.matchMedia("(min-width: 768px)").matches) {
      setIsOpen(true);
    }
  }, []);

  useEffect(() => {
    async function fetchSessions() {
      try {
        const res = await fetch("/api/chat/journal-sessions");
        if (!res.ok) return;
        const data = await res.json();
        setSessions(data.sessions ?? []);
      } catch {
        // silent — sidebar just shows empty
      }
    }

    fetchSessions();
  }, [pathname]);

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
        <div className="flex items-center justify-between px-4 py-3 border-b border-subtle shrink-0 h-14">
          <span className="text-sm font-semibold text-primary">Sessions</span>
        </div>

        <SessionsSidebar
          sessions={sessions}
          currentSessionId={currentSessionId}
        />
      </aside>

      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0 relative">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="absolute top-3 left-3 z-10 icon-btn"
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        >
          <LuMenu size={14} />
        </button>
        {children}
      </div>
    </div>
  );
}
