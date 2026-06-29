type Stat = {
  label: string;
  value: string;
  sub: string;
};

const STATS: Stat[] = [
  { label: "Current streak", value: "7", sub: "days" },
  { label: "ERP sessions", value: "12", sub: "this month" },
  { label: "Thought records", value: "8", sub: "this month" },
  { label: "Mood logs", value: "18", sub: "this month" },
];

export default function ProgressCard() {
  return (
    <div className="bg-card border border-subtle rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-primary">Your Progress</h2>
        <span className="text-xs text-muted">June 2026</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {STATS.map((s) => (
          <div key={s.label} className="bg-surface border border-subtle rounded-lg p-3">
            <p className="text-2xl font-bold text-accent">{s.value}</p>
            <p className="text-xs text-muted mt-0.5">{s.sub}</p>
            <p className="text-xs text-primary mt-1 font-medium">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
