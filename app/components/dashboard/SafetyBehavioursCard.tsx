type SafetyBehaviour = {
  id: string;
  behaviour: string;
  category: string;
  frequency: "Rarely" | "Sometimes" | "Often" | "Always";
};

const FREQUENCY_COLOR: Record<SafetyBehaviour["frequency"], string> = {
  Rarely: "bg-success/10 text-success border-success/20",
  Sometimes: "bg-warning-bg text-warning-text border-warning-border",
  Often: "bg-danger/10 text-danger border-danger/20",
  Always: "bg-danger/20 text-danger border-danger/30",
};

const PLACEHOLDER_BEHAVIOURS: SafetyBehaviour[] = [
  { id: "1", behaviour: "Googling to check if intrusive thought is 'normal'", category: "Reassurance seeking", frequency: "Often" },
  { id: "2", behaviour: "Asking family to confirm nothing bad happened", category: "Reassurance seeking", frequency: "Always" },
  { id: "3", behaviour: "Mentally replaying events to check for mistakes", category: "Mental checking", frequency: "Sometimes" },
  { id: "4", behaviour: "Avoiding knives when cooking", category: "Avoidance", frequency: "Rarely" },
];

export default function SafetyBehavioursCard() {
  return (
    <div className="bg-card border border-subtle rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-primary">Safety Behaviours</h2>
          <p className="text-xs text-muted mt-0.5">Subtle compulsions to work on dropping</p>
        </div>
        <button className="btn-accent">Add</button>
      </div>

      <ul className="space-y-2">
        {PLACEHOLDER_BEHAVIOURS.map((b) => (
          <li key={b.id} className="p-3 rounded-lg bg-surface border border-subtle space-y-1.5">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm text-primary leading-snug">{b.behaviour}</p>
              <span
                className={`shrink-0 text-[10px] font-medium border rounded-full px-2 py-0.5 ${FREQUENCY_COLOR[b.frequency]}`}
              >
                {b.frequency}
              </span>
            </div>
            <p className="text-xs text-muted">{b.category}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
