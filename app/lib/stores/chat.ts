import { create } from "zustand";

export interface SessionItem {
  id: string;
  createdAt: string;
  title: string;
}

type ChatStore = {
  chatSessions: SessionItem[] | null;
  fetchSessions: () => Promise<void>;
  updateSessionTitle: ({
    chatSessionId,
    title,
  }: {
    chatSessionId: string;
    title: string;
  }) => void;
  removeSessions: (ids: string[]) => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  chatSessions: null,
  fetchSessions: async () => {
    try {
      const res = await fetch("/api/chat/chat-sessions");
      if (!res.ok) return;
      const data = await res.json();
      set({ chatSessions: data.sessions ?? [] });
    } catch {
      // silent — sidebar shows empty
    }
  },
  updateSessionTitle: ({ chatSessionId, title }) =>
    set((state) => ({
      chatSessions:
        state.chatSessions?.map((s) =>
          s.id === chatSessionId ? { ...s, title } : s
        ) ?? state.chatSessions,
    })),
  removeSessions: (ids) =>
    set((state) => ({
      chatSessions:
        state.chatSessions?.filter((s) => !ids.includes(s.id)) ??
        state.chatSessions,
    })),
}));
