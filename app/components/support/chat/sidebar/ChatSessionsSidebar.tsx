"use client";

import { AnimatePresence } from "motion/react";
import PresenceFade from "@/app/components/common/PresenceFade";
import ChatSessionRow from "./ChatSessionRow";
import { useState } from "react";
import ChatSessionsSidebarLoader from "@/app/components/loaders/ChatSessionsSidebarLoader";
import { useRouter } from "next/navigation";
import { LuPencil } from "react-icons/lu";
import ChatSessionItem from "./ChatSessionItem";
import SidebarDeleteControls from "./SidebarDeleteControls";
import { cn } from "@/app/lib/cn";
import { useChatStore,removeSessions } from "@/app/lib/stores/chat";

type Props={
  currentSessionId: string;
};

export default function ChatSessionsSidebar({ currentSessionId }: Props) {
  const [isDeleteMode,setIsDeleteMode]=useState(false);
  const [selectedIds,setSelectedIds]=useState<Set<string>>(new Set());
  const [isDeleting,setIsDeleting]=useState(false);

  const chatSessions=useChatStore((s) => s.chatSessions);

  const router=useRouter();

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next=new Set(prev);
      if(next.has(id)) {
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
    if(selectedIds.size===0) return;

    setIsDeleting(true);
    try {
      const res=await fetch("/api/chat/chat-sessions",{
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      });
      if(res.ok) {
        removeSessions(selectedIds);
        cancelDeleteMode();

        if(currentSessionId&&selectedIds.has(currentSessionId)) {
          router.push(`/chat/${crypto.randomUUID()}`);
        }
      }
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
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
              :"cursor-pointer hover:bg-surface"
          )}
        >
          <LuPencil size={13} />
          New chat
        </button>

        <SidebarDeleteControls
          isDeleteMode={isDeleteMode}
          selectedCount={selectedIds.size}
          isDeleting={isDeleting}
          onEnterDeleteMode={() => setIsDeleteMode(true)}
          onCancel={cancelDeleteMode}
          onDelete={deleteSelected}
        />
      </div>

      <div className="relative flex-1 overflow-y-auto px-2 pb-3">
        {chatSessions==null? (
          <ChatSessionsSidebarLoader />
        ):(
          <AnimatePresence initial={false} mode="popLayout">
            {chatSessions.length===0? (
              <PresenceFade key="empty">
                <p className="text-xs text-muted text-center mt-8 px-3">
                  No past sessions yet.
                </p>
              </PresenceFade>
            ):(
              <PresenceFade key="list">
                <ul>
                  <AnimatePresence initial={false}>
                    {chatSessions.map((s) => (
                      <ChatSessionRow key={s.id}>
                        <ChatSessionItem
                          chatSession={s}
                          isActive={s.id===currentSessionId}
                          isDeleteMode={isDeleteMode}
                          isSelected={selectedIds.has(s.id)}
                          onToggleSelect={() => toggleSelect(s.id)}
                        />
                      </ChatSessionRow>
                    ))}
                  </AnimatePresence>
                </ul>
              </PresenceFade>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
