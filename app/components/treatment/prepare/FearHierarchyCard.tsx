import FearHierarchyForm from "@/app/components/treatment/prepare/FearHierarchyForm";
import FearHierarchyList from "@/app/components/treatment/prepare/FearHierarchyList";

export default function FearHierarchyCard() {
  return (
    <div className="bg-card border border-subtle rounded-xl p-4 flex flex-col gap-4 card-tall overflow-hidden">
      <div>
        <h2 className="text-sm font-semibold text-primary">Fear Hierarchy</h2>
        <p className="text-xs text-muted mt-0.5">
          Rank situations by anxiety level (SUDS 0–10)
        </p>
      </div>

      <FearHierarchyForm />

      <div className="flex-1 min-h-0 overflow-y-auto">
        <FearHierarchyList />
      </div>
    </div>
  );
}
