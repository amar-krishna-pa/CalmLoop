"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LuMessageSquare, LuPlus } from "react-icons/lu";

const PLACEHOLDER_SESSIONS = [
  { id: "1", title: "Feeling anxious about work", time: "2h ago" },
  { id: "2", title: "Intrusive thoughts session", time: "Yesterday" },
  { id: "3", title: "Morning check-in", time: "2 days ago" },
];

export default function ChatsCard() {
  const router = useRouter();

  return (
    <div className="bg-card border border-subtle rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-primary">Chats</h2>
        <button
          onClick={() => router.push(`/chat/${crypto.randomUUID()}`)}
          className="btn-accent flex items-center gap-1.5"
        >
          <LuPlus size={12} />
          New chat
        </button>
      </div>

      <ul className="space-y-0.5">
        {PLACEHOLDER_SESSIONS.map((s) => (
          <li key={s.id}>
            <Link
              href={`/chat/${s.id}`}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface transition-colors duration-150"
            >
              <LuMessageSquare size={14} className="text-muted shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-primary truncate">{s.title}</p>
                <p className="text-xs text-muted">{s.time}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
