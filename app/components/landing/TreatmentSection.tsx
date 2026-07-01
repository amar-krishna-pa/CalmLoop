type Tool = {
  name: string;
  detail: string;
};

type Phase = {
  number: string;
  name: string;
  tagline: string;
  tools: Tool[];
};

const phases: Phase[] = [
  {
    number: "01",
    name: "Prepare",
    tagline: "Map your triggers, fears & safety behaviours",
    tools: [
      {
        name: "Fear Hierarchy",
        detail: "Rank feared situations by SUDS score (0–10 anxiety scale)",
      },
      {
        name: "Trigger Log",
        detail: "Record intrusive thoughts with situational context and anxiety level",
      },
      {
        name: "Safety Behaviours",
        detail: "Identify compulsions by category (reassurance, avoidance, checking) and frequency",
      },
    ],
  },
  {
    number: "02",
    name: "Practice",
    tagline: "Log exposures, challenge thoughts & test predictions",
    tools: [
      {
        name: "ERP Tracker",
        detail: "Compare before vs. after anxiety across each exposure session",
      },
      {
        name: "Thought Records",
        detail: "Document intrusive thoughts, emotions, cognitive distortions & reframes",
      },
      {
        name: "Behavioural Experiments",
        detail: "Test catastrophic predictions against what actually happens",
      },
    ],
  },
  {
    number: "03",
    name: "Plan",
    tagline: "Structure homework & prepare for setbacks",
    tools: [
      {
        name: "Therapist Homework",
        detail: "Track assigned tasks with due dates and a completion checklist",
      },
      {
        name: "Relapse Prevention",
        detail: "Define your early warning signs and a personalised coping action plan",
      },
    ],
  },
];

export default function TreatmentSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="mb-16 text-center max-w-3xl mx-auto">
        <span className="text-xs font-semibold uppercase tracking-widest text-accent">
          Treatment Journey
        </span>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mt-3">
          Eight clinical tools, three phases
        </h2>
        <p className="mt-4 text-muted text-base">
          The Treatment section walks you through building awareness first,
          applying it in practice, then locking in long-term resilience — in
          that order.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {phases.map(({ number, name, tagline, tools }) => (
          <div
            key={name}
            className="rounded-2xl border border-subtle bg-card p-8 flex flex-col"
          >
            <div className="text-5xl font-extrabold text-accent/20 leading-none mb-4 select-none">
              {number}
            </div>
            <h3 className="text-xl font-bold mb-1">{name}</h3>
            <p className="text-xs text-muted mb-6">{tagline}</p>
            <ul className="space-y-4 grow">
              {tools.map(({ name: toolName, detail }) => (
                <li key={toolName} className="flex gap-3 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-1.5" />
                  <div>
                    <p className="text-sm font-semibold text-primary">{toolName}</p>
                    <p className="text-xs text-muted mt-0.5">{detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
