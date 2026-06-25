"use client";

import formatRelativeTime from "@/app/utils/formatRelativeTime";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LuPencil } from "react-icons/lu";

export interface SessionItem {
  id: string;
  createdAt: string;
  title: string | null;
}

interface Props {
  sessions: SessionItem[];
  currentSessionId: string;
}

export default function SessionsSidebar({ sessions, currentSessionId }: Props) {
  const router = useRouter();

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 shrink-0">
        <button
          onClick={() => router.push(`/chat/${crypto.randomUUID()}`)}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg cursor-pointer text-sm font-medium text-primary bg-primary border border-subtle hover:bg-surface transition-colors duration-150"
        >
          <LuPencil size={13} />
          New session
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-3">
        {sessions.length === 0 && (
          <p className="text-xs text-muted text-center mt-8 px-3">
            No past sessions yet.
          </p>
        )}

        <ul className="space-y-0.5">
          {sessions.map((s) => {
            const isActive = s.id === currentSessionId;

            return (
              <li key={s.id}>
                <Link
                  href={`/chat/${s.id}`}
                  className={`block px-3 py-2 rounded-lg transition-colors duration-150 ${
                    isActive
                      ? "bg-accent/10 border border-accent/20"
                      : "hover:bg-surface"
                  }`}
                >
                  <p className="text-xs text-muted mb-0.5">
                    {formatRelativeTime(s.createdAt)}
                  </p>

                  <p
                    className={`text-sm truncate ${
                      isActive ? "text-accent font-medium" : "text-primary"
                    }`}
                  >
                    {s.title ?? "Unamed session"}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
