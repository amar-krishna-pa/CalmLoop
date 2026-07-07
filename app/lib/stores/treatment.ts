import { create } from "zustand";
import { toast } from "sonner";

export type HierarchyItem = {
  id: string;
  situation: string;
  initialSuds: number;
  currentSuds: number;
};

type TreatmentStore = {
  fearHierarchyItems: HierarchyItem[] | null;
  fearHierarchyLoading: boolean;
  fearHierarchyFetchError: boolean;
};

export const useTreatmentStore = create<TreatmentStore>(() => ({
  fearHierarchyItems: null,
  fearHierarchyLoading: true,
  fearHierarchyFetchError: false,
}));

export async function createFearHierarchyItem({
  situation,
  initialSuds,
}: {
  situation: string;
  initialSuds: number;
}): Promise<boolean> {
  try {
    const res = await fetch("/api/treatment/fear-hierarchy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ situation, initialSuds }),
    });

    if (!res.ok) throw new Error();

    const data = await res.json();

    useTreatmentStore.setState((state) => ({
      fearHierarchyItems: [
        ...(state.fearHierarchyItems ?? []),
        data.item,
      ].sort((a, b) => a.initialSuds - b.initialSuds),
    }));

    return true;
  } catch {
    toast.error("Failed to add item");
    return false;
  }
}

export async function fetchFearHierarchyItems() {
  useTreatmentStore.setState({
    fearHierarchyLoading: true,
    fearHierarchyFetchError: false,
  });
  try {
    const res = await fetch("/api/treatment/fear-hierarchy");
    if (!res.ok) throw new Error();
    const data = await res.json();
    useTreatmentStore.setState({
      fearHierarchyItems: data.items,
      fearHierarchyLoading: false,
    });
  } catch {
    useTreatmentStore.setState({
      fearHierarchyLoading: false,
      fearHierarchyFetchError: true,
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
  useTreatmentStore.setState((state) => ({
    fearHierarchyItems:
      state.fearHierarchyItems?.map((item) =>
        item.id === id ? { ...item, currentSuds } : item
      ) ?? state.fearHierarchyItems,
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
    const res = await fetch(`/api/treatment/fear-hierarchy/${id}`, {
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
    const res = await fetch(`/api/treatment/fear-hierarchy/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error();

    useTreatmentStore.setState((state) => ({
      fearHierarchyItems:
        state.fearHierarchyItems?.filter((item) => item.id !== id) ?? null,
    }));

    return true;
  } catch {
    toast.error("Failed to delete item");
    return false;
  }
}
