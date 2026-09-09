import PsychoeducationCard from "@/app/components/learn/PsychoeducationCard";
import CognitiveDistortionsCard from "@/app/components/learn/CognitiveDistortionsCard";

export default function LearnPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-primary">Learn</h1>
        <p className="text-sm text-muted mt-1">Understand OCD and how to work with it</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PsychoeducationCard />
        <CognitiveDistortionsCard />
      </div>
    </div>
  );
}
