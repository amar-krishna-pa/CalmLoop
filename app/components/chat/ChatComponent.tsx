"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import type { UIMessage } from "ai";
import { useChatStore } from "@/app/lib/stores/chat";

export default function ChatComponent({
  chatSessionId,
  initialMessages,
}: {
  chatSessionId: string;
  initialMessages: UIMessage[];
}) {
  const [input, setInput] = useState("");

  const hasFiredRef = useRef(false);

  const fetchSessions = useChatStore((s) => s.actions.fetchSessions);

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
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                  message.role === "user"
                    ? "bg-accent text-on-accent"
                    : "bg-card text-primary border border-subtle"
                }`}
              >
                {message.parts.map((part, i) => {
                  if (part.type === "text")
                    return <span key={i}>{part.text}</span>;
                })}
              </div>
            </div>
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

      <div className="border-t border-subtle px-4 py-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="flex gap-2 items-center max-w-2xl mx-auto"
        >
          <textarea
            value={input}
            placeholder="Share what's on your mind…"
            rows={1}
            disabled={isBusy}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            className="input-base resize-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isBusy || !input.trim()}
            className="btn-accent disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
