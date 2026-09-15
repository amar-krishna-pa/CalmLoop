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
    desc: "An unwanted thought that feels troubling",
    accent: "bg-warning-text/70",
  },
  {
    label: "Anxiety",
    desc: "You may feel anxious or uncomfortable",
    accent: "bg-danger/60",
  },
  {
    label: "Compulsion",
    desc: "An action you feel driven to repeat for relief, such as checking or asking for reassurance",
    accent: "bg-accent/60",
  },
  {
    label: "Short-term relief",
    desc: "The action may bring brief relief",
    accent: "bg-success/60",
  },
  {
    label: "The loop repeats",
    desc: "The urge to repeat the action may return",
    accent: "bg-danger/40",
  },
];

export default function PsychoeducationCard() {
  return (
    <div className="bg-card border border-subtle rounded-xl p-4 flex flex-col gap-4">
      <div>
        <h2 className="text-sm font-semibold text-primary">Understanding OCD</h2>
        <p className="text-xs text-muted mt-0.5">How thoughts, feelings and repeated actions can form a loop</p>
      </div>

      <div className="space-y-2">
        {OCD_CYCLE.map((step, i) => (
          <div key={step.label} className="flex gap-3 items-start">
            <div className="flex flex-col items-center shrink-0">
              <div className={`w-6 h-6 rounded-full ${step.accent} flex items-center justify-center`}>
                <span className="text-2xs font-bold text-white">{i + 1}</span>
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
        Exposure and response prevention (ERP) involves gradually facing feared situations while practising without compulsions. A therapist can help you choose manageable steps.
      </p>
    </div>
  );
}
