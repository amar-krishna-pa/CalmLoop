type Step = {
  label: string;
  desc: string;
  accent: string;
};

const OCD_CYCLE: Step[] = [
  {
    label: "Trigger",
    desc: "A situation, thought, image, or feeling",
    accent: "bg-muted",
  },
  {
    label: "Intrusive thought",
    desc: "An unwanted thought your brain labels as dangerous",
    accent: "bg-warning-text/70",
  },
  {
    label: "Anxiety",
    desc: "Distress spikes — your brain sends an alarm signal",
    accent: "bg-danger/60",
  },
  {
    label: "Compulsion",
    desc: "You act to neutralise the anxiety (checking, reassurance, avoidance)",
    accent: "bg-accent/60",
  },
  {
    label: "Short-term relief",
    desc: "Anxiety drops — but the compulsion teaches your brain the threat was real",
    accent: "bg-success/60",
  },
  {
    label: "Reinforcement",
    desc: "The cycle strengthens. OCD learns it can trigger you again",
    accent: "bg-danger/40",
  },
];

export default function PsychoeducationCard() {
  return (
    <div className="bg-card border border-subtle rounded-xl p-4 flex flex-col gap-4">
      <div>
        <h2 className="text-sm font-semibold text-primary">Understanding OCD</h2>
        <p className="text-xs text-muted mt-0.5">The OCD cycle — why compulsions make it worse</p>
      </div>

      <div className="space-y-2">
        {OCD_CYCLE.map((step, i) => (
          <div key={step.label} className="flex gap-3 items-start">
            <div className="flex flex-col items-center shrink-0">
              <div className={`w-6 h-6 rounded-full ${step.accent} flex items-center justify-center`}>
                <span className="text-[10px] font-bold text-white">{i + 1}</span>
              </div>
              {i < OCD_CYCLE.length - 1 && (
                <div className="w-px h-4 bg-subtle mt-1" />
              )}
            </div>
            <div className="pb-1">
              <p className="text-sm font-medium text-primary">{step.label}</p>
              <p className="text-xs text-muted leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted border-l-2 border-accent/40 pl-3 leading-relaxed">
        ERP works by breaking the cycle at step 4 — sitting with the anxiety without performing the compulsion, so your brain learns the threat was never real.
      </p>
    </div>
  );
}
