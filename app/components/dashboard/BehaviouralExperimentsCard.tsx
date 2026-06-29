type Experiment = {
  id: string;
  prediction: string;
  experiment: string;
  outcome: string | null;
  date: string;
};

const PLACEHOLDER_EXPERIMENTS: Experiment[] = [
  {
    id: "1",
    prediction: "If I don't check the lock, I will be burgled tonight",
    experiment: "Leave home without checking the lock even once",
    outcome: "Got home — door was fine. Nothing happened.",
    date: "Jun 27",
  },
  {
    id: "2",
    prediction: "If I touch the handrail, I will definitely get sick",
    experiment: "Touch handrail and don't wash hands for 2 hours",
    outcome: null,
    date: "Today",
  },
];

export default function BehaviouralExperimentsCard() {
  return (
    <div className="bg-card border border-subtle rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-primary">Behavioural Experiments</h2>
          <p className="text-xs text-muted mt-0.5">Test your predictions against reality</p>
        </div>
        <button className="btn-accent">New experiment</button>
      </div>

      <ul className="space-y-2">
        {PLACEHOLDER_EXPERIMENTS.map((e) => (
          <li key={e.id} className="p-3 rounded-lg bg-surface border border-subtle space-y-2">
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-medium text-muted uppercase tracking-wide">Prediction</p>
              <span className="text-xs text-muted shrink-0">{e.date}</span>
            </div>
            <p className="text-sm text-primary leading-snug">{e.prediction}</p>

            <p className="text-xs font-medium text-muted uppercase tracking-wide">Experiment</p>
            <p className="text-sm text-primary leading-snug">{e.experiment}</p>

            {e.outcome ? (
              <>
                <p className="text-xs font-medium text-muted uppercase tracking-wide">What actually happened</p>
                <p className="text-sm text-primary leading-snug border-l-2 border-accent/40 pl-2">
                  {e.outcome}
                </p>
              </>
            ) : (
              <button className="text-xs text-accent hover:underline cursor-pointer">
                + Record outcome
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
