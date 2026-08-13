import DailyQuoteCard from "@/app/components/dashboard/DailyQuoteCard";
import ProgressCard from "@/app/components/today/ProgressCard";
import UpcomingSessionCard from "@/app/components/dashboard/UpcomingSessionCard";
import MoodTrackerCard from "@/app/components/dashboard/MoodTrackerCard";
import SleepStressCard from "@/app/components/dashboard/SleepStressCard";
import MedicationTrackerCard from "@/app/components/dashboard/MedicationTrackerCard";

export default function TodayPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-primary">Today</h1>
        <p className="text-sm text-muted mt-1">Your daily check-in</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DailyQuoteCard />
        <ProgressCard />
        <UpcomingSessionCard />
        <MoodTrackerCard />
        <SleepStressCard />
        <MedicationTrackerCard />
      </div>
    </div>
  );
}
