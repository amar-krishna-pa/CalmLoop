import { create } from "zustand";
import { toast } from "sonner";

export type ErpSession = {
  id: string;
  trigger: string;
  anxietyBefore: number;
  anxietyAfter: number;
  notes: string | null;
  createdAt: string;
};

type ErpSessionStore = {
  sessions: ErpSession[] | null;
  loading: boolean;
  fetchError: boolean;
};

export const useErpSessionStore = create<ErpSessionStore>(() => ({
  sessions: null,
  loading: true,
  fetchError: false,
}));

export async function fetchErpSessions() {
  useErpSessionStore.setState({
    loading: true,
    fetchError: false,
  });

  try {
    const res = await fetch("/api/treatment/erp-session");

    if (!res.ok) throw new Error();

    const data = await res.json();
    useErpSessionStore.setState({
      sessions: data.sessions,
      loading: false,
    });
  } catch {
    useErpSessionStore.setState({
      loading: false,
      fetchError: true,
    });
  }
}

export async function createErpSession({
  trigger,
  anxietyBefore,
  anxietyAfter,
  notes,
}: {
  trigger: string;
  anxietyBefore: number;
  anxietyAfter: number;
  notes?: string;
}): Promise<boolean> {
  try {
    const res = await fetch("/api/treatment/erp-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trigger, anxietyBefore, anxietyAfter, notes }),
    });

    if (!res.ok) throw new Error();

    const data = await res.json();

    useErpSessionStore.setState((state) => ({
      sessions: [data.session, ...(state.sessions ?? [])],
    }));

    return true;
  } catch {
    toast.error("Failed to log ERP session");
    return false;
  }
}

export async function deleteErpSession({
  id,
}: {
  id: string;
}): Promise<boolean> {
  try {
    const res = await fetch(`/api/treatment/erp-session/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error();

    useErpSessionStore.setState((state) => ({
      sessions: state.sessions?.filter((session) => session.id !== id) ?? null,
    }));

    return true;
  } catch {
    toast.error("Failed to delete ERP session");
    return false;
  }
}
