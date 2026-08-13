import { create } from "zustand";
import { toast } from "sonner";

export type HierarchyItem = {
  id: string;
  situation: string;
  initialSuds: number;
  currentSuds: number;
};

type FearHierarchyStore = {
  items: HierarchyItem[] | null;
  loading: boolean;
  fetchError: boolean;
};

export const useFearHierarchyStore = create<FearHierarchyStore>(() => ({
  items: null,
  loading: true,
  fetchError: false,
}));

export async function createFearHierarchyItem({
  situation,
  initialSuds,
}: {
  situation: string;
  initialSuds: number;
}): Promise<boolean> {
  try {
    const res = await fetch("/api/practice/fear-hierarchy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ situation, initialSuds }),
    });

    if (!res.ok) throw new Error();

    const data = await res.json();

    useFearHierarchyStore.setState((state) => ({
      items: [...(state.items ?? []), data.item].sort(
        (a, b) => a.initialSuds - b.initialSuds
      ),
    }));

    return true;
  } catch {
    toast.error("Failed to add item");
    return false;
  }
}

export async function fetchFearHierarchyItems() {
  useFearHierarchyStore.setState({
    loading: true,
    fetchError: false,
  });
  try {
    const res = await fetch("/api/practice/fear-hierarchy");
    if (!res.ok) throw new Error();
    const data = await res.json();
    useFearHierarchyStore.setState({
      items: data.items,
      loading: false,
    });
  } catch {
    useFearHierarchyStore.setState({
      loading: false,
      fetchError: true,
    });
  }
}

export function updateCurrentSudsState({
  id,
  currentSuds,
}: {
  id: string;
  currentSuds: number;
}) {
  useFearHierarchyStore.setState((state) => ({
    items:
      state.items?.map((item) =>
        item.id === id ? { ...item, currentSuds } : item
      ) ?? state.items,
  }));
}

export async function patchCurrentSuds({
  id,
  currentSuds,
}: {
  id: string;
  currentSuds: number;
}): Promise<boolean> {
  try {
    const res = await fetch(`/api/practice/fear-hierarchy/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentSuds }),
    });

    if (!res.ok) throw new Error();

    return true;
  } catch {
    toast.error("Failed to update SUDS level");
    return false;
  }
}

export async function deleteFearHierarchyItem({
  id,
}: {
  id: string;
}): Promise<boolean> {
  try {
    const res = await fetch(`/api/practice/fear-hierarchy/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error();

    useFearHierarchyStore.setState((state) => ({
      items: state.items?.filter((item) => item.id !== id) ?? null,
    }));

    return true;
  } catch {
    toast.error("Failed to delete item");
    return false;
  }
}
