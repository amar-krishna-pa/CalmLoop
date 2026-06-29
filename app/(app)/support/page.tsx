import ChatsCard from "@/app/components/dashboard/ChatsCard";
import GroundingExercisesCard from "@/app/components/dashboard/GroundingExercisesCard";

export default function SupportPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-primary">Support</h1>
        <p className="text-sm text-muted mt-1">Help when you need it</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChatsCard />
        <GroundingExercisesCard />
      </div>
    </div>
  );
}
