"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import type { UIMessage } from "ai";
import { fetchSessions } from "@/app/stores/chat";
import ChatMessage from "@/app/components/chat/ChatMessage";
import ChatComposer from "@/app/components/chat/ChatComposer";

export default function ChatComponent({
  chatSessionId,
  initialMessages,
}: {
  chatSessionId: string;
  initialMessages: UIMessage[];
}) {
  const [input, setInput] = useState("");

  const hasFiredRef = useRef(false);

  const isNewSession = initialMessages.length === 0;

  const { messages, sendMessage, status } = useChat({
    messages: initialMessages,
    onFinish: () => {
      if (isNewSession && !hasFiredRef.current) {
        hasFiredRef.current = true;
        fetchSessions();
      }
    },
  });

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isBusy = status === "submitted" || status === "streaming";

  function submit() {
    const text = input.trim();
    if (!text || isBusy) return;

    setInput("");
    sendMessage({ text }, { body: { chatSessionId } });
  }

  return (
    <div className="flex flex-col h-full bg-primary">
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.length === 0 && (
            <p className="text-center text-muted text-sm mt-16">
              How are you feeling today?
            </p>
          )}

          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {status === "submitted" && (
            <div className="flex justify-start">
              <div className="bg-card border border-subtle rounded-2xl px-4 py-2.5">
                <span className="text-muted text-sm">...</span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      <ChatComposer
        input={input}
        isBusy={isBusy}
        onInputChange={({ value }) => setInput(value)}
        onSubmit={submit}
      />
    </div>
  );
}
