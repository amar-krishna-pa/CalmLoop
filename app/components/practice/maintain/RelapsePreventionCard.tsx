type WarningSign = {
  id: string;
  sign: string;
};

type CopingStep = {
  id: string;
  step: string;
};

const WARNING_SIGNS: WarningSign[] = [
  { id: "1", sign: "Noticing more checking" },
  { id: "2", sign: "Avoiding situations I had been facing" },
  { id: "3", sign: "Asking family for reassurance more often" },
  { id: "4", sign: "Sleeping poorly for more than 3 nights" },
];

const COPING_STEPS: CopingStep[] = [
  { id: "1", step: "Choose a small situation from my saved fears to practise" },
  { id: "2", step: "Write a brief note about what came up" },
  { id: "3", step: "Talk with my therapist about what has changed" },
  { id: "4", step: "Discuss a manageable practice step with my therapist" },
];

export default function RelapsePreventionCard() {
  return (
    <div className="bg-card border border-subtle rounded-xl p-4 flex flex-col gap-4 card-medium">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-primary">Planning for harder days</h2>
          <p className="text-xs text-muted mt-0.5">Example plan for harder days. Editing is not available yet.</p>
        </div>
        <button className="btn-accent">Edit plan</button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto space-y-4">
        <div>
          <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">
            Changes I might notice
          </p>
          <ul className="space-y-1.5">
            {WARNING_SIGNS.map((w) => (
              <li key={w.id} className="flex items-start gap-2">
                <span className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-warning-text/70" />
                <p className="text-sm text-primary leading-snug">{w.sign}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-subtle pt-4">
          <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">
            What I can try
          </p>
          <ol className="space-y-1.5">
            {COPING_STEPS.map((s, i) => (
              <li key={s.id} className="flex items-start gap-2.5">
                <span className="shrink-0 w-5 h-5 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <span className="text-2xs font-bold text-accent">{i + 1}</span>
                </span>
                <p className="text-sm text-primary leading-snug pt-0.5">{s.step}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
