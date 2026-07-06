import FearHierarchyForm from "@/app/components/treatment/FearHierarchyForm";

export default function FearHierarchyCard() {
  return (
    <div className="bg-card border border-subtle rounded-xl p-4 flex flex-col gap-4">
      <div>
        <h2 className="text-sm font-semibold text-primary">Fear Hierarchy</h2>
        <p className="text-xs text-muted mt-0.5">
          Rank situations by anxiety level (SUDS 0–10)
        </p>
      </div>

      <FearHierarchyForm />
    </div>
  );
}
