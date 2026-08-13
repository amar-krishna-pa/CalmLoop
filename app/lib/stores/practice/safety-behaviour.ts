import { create } from "zustand";
import { toast } from "sonner";
import { SAFETY_BEHAVIOUR_FREQUENCIES } from "@/app/lib/zod/safety-behaviour";

export type SafetyBehaviour = {
  id: string;
  behaviour: string;
  category: string;
  frequency: (typeof SAFETY_BEHAVIOUR_FREQUENCIES)[number];
  createdAt: string;
};

type SafetyBehaviourStore = {
  entries: SafetyBehaviour[] | null;
  loading: boolean;
  fetchError: boolean;
};

export const useSafetyBehaviourStore = create<SafetyBehaviourStore>(() => ({
  entries: null,
  loading: true,
  fetchError: false,
}));

function sortByFrequency(items: SafetyBehaviour[]): SafetyBehaviour[] {
  return [...items].sort(
    (a, b) =>
      SAFETY_BEHAVIOUR_FREQUENCIES.indexOf(b.frequency) -
      SAFETY_BEHAVIOUR_FREQUENCIES.indexOf(a.frequency)
  );
}

export async function createSafetyBehaviour({
  behaviour,
  category,
  frequency,
}: {
  behaviour: string;
  category: string;
  frequency: (typeof SAFETY_BEHAVIOUR_FREQUENCIES)[number];
}): Promise<boolean> {
  try {
    const res = await fetch("/api/practice/safety-behaviour", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ behaviour, category, frequency }),
    });

    if (!res.ok) throw new Error();

    const data = await res.json();

    useSafetyBehaviourStore.setState((state) => ({
      entries: sortByFrequency([...(state.entries ?? []), data.entry]),
    }));

    return true;
  } catch {
    toast.error("Failed to add safety behaviour");
    return false;
  }
}

export async function fetchSafetyBehaviours() {
  useSafetyBehaviourStore.setState({
    loading: true,
    fetchError: false,
  });

  try {
    const res = await fetch("/api/practice/safety-behaviour");

    if (!res.ok) throw new Error();

    const data = await res.json();
    useSafetyBehaviourStore.setState({
      entries: data.entries,
      loading: false,
    });
  } catch {
    useSafetyBehaviourStore.setState({
      loading: false,
      fetchError: true,
    });
  }
}

export async function deleteSafetyBehaviour({
  id,
}: {
  id: string;
}): Promise<boolean> {
  try {
    const res = await fetch(`/api/practice/safety-behaviour/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error();

    useSafetyBehaviourStore.setState((state) => ({
      entries: state.entries?.filter((entry) => entry.id !== id) ?? null,
    }));

    return true;
  } catch {
    toast.error("Failed to delete safety behaviour");
    return false;
  }
}
