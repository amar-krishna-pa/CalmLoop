type Distortion = {
  name: string;
  desc: string;
};

const DISTORTIONS: Distortion[] = [
  {
    name: "Thought-action fusion",
    desc: "Believing that having a thought is the same as acting on it",
  },
  {
    name: "Catastrophising",
    desc: "Assuming the worst possible outcome will happen",
  },
  {
    name: "Overestimating threat",
    desc: "Treating unlikely dangers as highly probable",
  },
  {
    name: "All-or-nothing",
    desc: "Seeing situations as entirely good or entirely bad, with no middle ground",
  },
  {
    name: "Emotional reasoning",
    desc: "Taking feelings as proof — 'I feel guilty so I must have done something wrong'",
  },
  {
    name: "Intolerance of uncertainty",
    desc: "Needing to be 100% certain before feeling safe",
  },
];

export default function CognitiveDistortionsCard() {
  return (
    <div className="bg-card border border-subtle rounded-xl p-4 flex flex-col gap-4">
      <h2 className="text-sm font-semibold text-primary">Cognitive Distortions</h2>

      <ul className="space-y-2">
        {DISTORTIONS.map((d) => (
          <li key={d.name} className="flex gap-3 p-3 rounded-lg bg-surface border border-subtle">
            <div className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-accent" />
            <div>
              <p className="text-sm font-medium text-primary">{d.name}</p>
              <p className="text-xs text-muted mt-0.5 leading-relaxed">{d.desc}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
