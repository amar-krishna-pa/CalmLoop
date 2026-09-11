import type { UIMessage } from "ai";
import { cn } from "@/app/lib/cn";

type Props = { message: UIMessage };

export default function ChatMessage({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
          isUser
            ? "bg-accent text-on-accent"
            : "bg-card text-primary border border-subtle",
        )}
      >
        {message.parts.flatMap((part) => part.type === "text" ? [part.text] : [])}
      </div>
    </div>
  );
}
