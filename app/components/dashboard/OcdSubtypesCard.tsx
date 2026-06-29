type Subtype = {
  label: string;
  value: number;
};

const SUBTYPES: Subtype[] = [
  { label: "Contamination", value: 72 },
  { label: "Checking", value: 58 },
  { label: "Harm OCD", value: 45 },
  { label: "Pure O", value: 38 },
  { label: "Symmetry", value: 30 },
  { label: "Religious", value: 22 },
];

export default function OcdSubtypesCard() {
  const max = Math.max(...SUBTYPES.map((s) => s.value));

  return (
    <div className="bg-card border border-subtle rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-primary">OCD Subtypes</h2>
        <span className="text-xs text-muted">Last 30 days</span>
      </div>

      <div className="space-y-3">
        {SUBTYPES.map((s) => (
          <div key={s.label} className="flex items-center gap-3">
            <span className="text-xs text-muted w-24 shrink-0">{s.label}</span>
            <div className="flex-1 bg-surface rounded-full h-2">
              <div
                className="bg-accent rounded-full h-2 transition-all duration-500"
                style={{ width: `${(s.value / max) * 100}%` }}
              />
            </div>
            <span className="text-xs text-muted w-6 text-right">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
