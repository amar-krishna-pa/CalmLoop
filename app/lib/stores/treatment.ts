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
};

export const useTreatmentStore = create<TreatmentStore>(() => ({
  fearHierarchyItems: null,
}));

export async function fetchFearHierarchyItems() {
  try {
    const res = await fetch("/api/treatment/fear-hierarchy");
    if (!res.ok) throw new Error();
    const data = await res.json();
    useTreatmentStore.setState({ fearHierarchyItems: data.items });
  } catch {
    toast.error("Failed to load fear hierarchy");
    useTreatmentStore.setState({ fearHierarchyItems: [] });
  }
}
