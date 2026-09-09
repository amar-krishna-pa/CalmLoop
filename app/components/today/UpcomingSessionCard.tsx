import { LuCalendar, LuClock, LuUser } from "react-icons/lu";

const PLACEHOLDER_SESSION = {
  therapistName: "Dr. Sarah Okonkwo",
  date: "Tuesday, July 1",
  time: "3:00 PM",
  type: "Video call",
};

export default function UpcomingSessionCard() {
  return (
    <div className="bg-card border border-subtle rounded-xl p-4 flex flex-col gap-4">
      <h2 className="text-sm font-semibold text-primary">Upcoming Session</h2>

      <div className="bg-accent/5 border border-accent/20 rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2">
          <LuUser size={14} className="text-accent shrink-0" />
          <p className="text-sm text-primary font-medium">{PLACEHOLDER_SESSION.therapistName}</p>
        </div>
        <div className="flex items-center gap-2">
          <LuCalendar size={14} className="text-accent shrink-0" />
          <p className="text-sm text-primary">{PLACEHOLDER_SESSION.date}</p>
        </div>
        <div className="flex items-center gap-2">
          <LuClock size={14} className="text-accent shrink-0" />
          <p className="text-sm text-primary">{PLACEHOLDER_SESSION.time} · {PLACEHOLDER_SESSION.type}</p>
        </div>
      </div>

      <button className="btn-accent self-start">Join session</button>
    </div>
  );
}
