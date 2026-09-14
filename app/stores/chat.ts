import { create } from "zustand";

export type SessionItem = {
  id: string;
  createdAt: string;
  title: string;
};

type ChatStore = {
  chatSessions: SessionItem[] | null;
};

export const useChatStore = create<ChatStore>(() => ({
  chatSessions: null,
}));

export async function fetchSessions() {
  try {
    const res = await fetch("/api/chat/chat-sessions");
    if (!res.ok) return;
    const data = await res.json();
    useChatStore.setState({ chatSessions: data.sessions ?? [] });
  } catch {
    // silent — sidebar shows empty
  }
}

export function updateSessionTitle({
  chatSessionId,
  title,
}: {
  chatSessionId: string;
  title: string;
}) {
  useChatStore.setState((state) => ({
    chatSessions:
      state.chatSessions?.map((s) =>
        s.id === chatSessionId ? { ...s, title } : s
      ) ?? state.chatSessions,
  }));
}

export function removeSessions(ids: Set<string>) {
  useChatStore.setState((state) => ({
    chatSessions:
      state.chatSessions?.filter((s) => !ids.has(s.id)) ??
      state.chatSessions,
  }));
}
