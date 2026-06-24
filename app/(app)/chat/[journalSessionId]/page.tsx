"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { UIMessage } from "ai";
import ChatComponent from "@/app/components/chat/ChatComponent";

export default function ChatPage() {
  const { journalSessionId } = useParams<{ journalSessionId: string }>();

  const [initialMessages, setInitialMessages] = useState<UIMessage[] | null>(
    null
  );

  useEffect(() => {
    fetch(`/api/chat/history?journalSessionId=${journalSessionId}`)
      .then((r) => r.json())
      .then((data) => setInitialMessages(data.messages ?? []))
      .catch(() => setInitialMessages([]));
  }, [journalSessionId]);

  if (initialMessages === null) {
    return (
      <div className="flex flex-col h-full bg-primary items-center justify-center">
        <span className="text-muted text-sm">Loading…</span>
      </div>
    );
  }

  return (
    <ChatComponent
      journalSessionId={journalSessionId}
      initialMessages={initialMessages}
    />
  );
}
