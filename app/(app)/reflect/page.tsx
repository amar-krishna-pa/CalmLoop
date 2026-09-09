import JournalCard from "@/app/components/reflect/JournalCard";
import OcdSubtypesCard from "@/app/components/reflect/OcdSubtypesCard";

export default function ReflectPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-primary">Reflect</h1>
        <p className="text-sm text-muted mt-1">Write and see your patterns</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <JournalCard />
        <OcdSubtypesCard />
      </div>
    </div>
  );
}
