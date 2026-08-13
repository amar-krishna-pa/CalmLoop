import { create } from "zustand";
import { toast } from "sonner";

export type TriggerLogEntry = {
  id: string;
  trigger: string;
  context: string;
  anxietyLevel: number;
  createdAt: string;
};

type TriggerLogStore = {
  entries: TriggerLogEntry[] | null;
  loading: boolean;
  fetchError: boolean;
};

export const useTriggerLogStore = create<TriggerLogStore>(() => ({
  entries: null,
  loading: true,
  fetchError: false,
}));

export async function createTriggerLogEntry({
  trigger,
  context,
  anxietyLevel,
}: {
  trigger: string;
  context: string;
  anxietyLevel: number;
}): Promise<boolean> {
  try {
    const res = await fetch("/api/practice/trigger-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trigger, context, anxietyLevel }),
    });

    if (!res.ok) throw new Error();

    const data = await res.json();

    useTriggerLogStore.setState((state) => ({
      entries: [data.entry, ...(state.entries ?? [])],
    }));

    return true;
  } catch {
    toast.error("Failed to log trigger");
    return false;
  }
}

export async function fetchTriggerLogEntries() {
  useTriggerLogStore.setState({
    loading: true,
    fetchError: false,
  });

  try {
    const res = await fetch("/api/practice/trigger-log");

    if (!res.ok) throw new Error();

    const data = await res.json();
    useTriggerLogStore.setState({
      entries: data.entries,
      loading: false,
    });
  } catch {
    useTriggerLogStore.setState({
      loading: false,
      fetchError: true,
    });
  }
}

export async function deleteTriggerLogEntry({
  id,
}: {
  id: string;
}): Promise<boolean> {
  try {
    const res = await fetch(`/api/practice/trigger-log/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error();

    useTriggerLogStore.setState((state) => ({
      entries: state.entries?.filter((entry) => entry.id !== id) ?? null,
    }));

    return true;
  } catch {
    toast.error("Failed to delete entry");
    return false;
  }
}
