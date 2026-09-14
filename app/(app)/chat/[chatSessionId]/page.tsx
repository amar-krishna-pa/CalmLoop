"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { UIMessage } from "ai";
import ChatComponent from "@/app/components/chat/ChatComponent";
import ChatPageLoader from "@/app/components/loaders/ChatPageLoader";

export default function ChatPage() {
  const { chatSessionId } = useParams<{ chatSessionId: string }>();

  const [initialMessages, setInitialMessages] = useState<UIMessage[] | null>(
    null
  );

  useEffect(() => {
    fetch(`/api/chat/chat-sessions/${chatSessionId}/messages`)
      .then((r) => r.json())
      .then((data) => setInitialMessages(data.messages ?? []))
      .catch(() => setInitialMessages([]));
  }, [chatSessionId]);

  if (initialMessages === null) {
    return <ChatPageLoader />;
  }

  return (
    <ChatComponent
      chatSessionId={chatSessionId}
      initialMessages={initialMessages}
    />
  );
}
