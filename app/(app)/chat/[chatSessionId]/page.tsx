"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { UIMessage } from "ai";
import ChatComponent from "@/app/components/chat/ChatComponent";

export default function ChatPage() {
  const { chatSessionId } = useParams<{ chatSessionId: string }>();

  const [initialMessages, setInitialMessages] = useState<UIMessage[] | null>(
    null
  );

  useEffect(() => {
    fetch(`/api/chat/history?chatSessionId=${chatSessionId}`)
      .then((r) => r.json())
      .then((data) => setInitialMessages(data.messages ?? []))
      .catch(() => setInitialMessages([]));
  }, [chatSessionId]);

  if (initialMessages === null) {
    return (
      <div className="flex flex-col h-full bg-primary items-center justify-center">
        <span className="text-muted text-sm">Loading…</span>
      </div>
    );
  }

  return (
    <ChatComponent
      chatSessionId={chatSessionId}
      initialMessages={initialMessages}
    />
  );
}
