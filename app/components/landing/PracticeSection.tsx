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
    tagline: "Describe situations and how you respond",
    tools: [
      {
        name: "Saved fears",
        detail: "Keep a list of situations you want to explore. One is enough to begin.",
      },
      {
        name: "Your entry",
        detail: "Describe what happened and how distressing it felt.",
      },
      {
        name: "Safety behaviours",
        detail: "Note actions used to seek certainty or relief, such as repeated checking.",
      },
    ],
  },
  {
    number: "02",
    name: "Exposures",
    tagline: "View situations you have saved for practice",
    tools: [
      {
        name: "Practice situations",
        detail: "See entries connected to your saved fears.",
      },
      {
        name: "Your descriptions",
        detail: "Read what you wrote about each situation.",
      },
      {
        name: "Distress ratings",
        detail: "See how distressing a situation felt on a scale from 0 to 10.",
      },
    ],
  },
  {
    number: "03",
    name: "Maintain",
    tagline: "Explore examples of practice and support plans",
    tools: [
      {
        name: "Practice with your therapist",
        detail: "Preview a list of practice tasks to discuss with a therapist.",
      },
      {
        name: "Planning for harder days",
        detail: "Explore an example plan for changes you might notice and support you could use.",
      },
    ],
  },
];

export default function PracticeSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="mb-16 text-center max-w-3xl mx-auto">
        <span className="text-xs font-semibold uppercase tracking-widest text-accent">
          Practice at your pace
        </span>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mt-3">
          Three spaces to explore
        </h2>
        <p className="mt-4 text-muted text-base">
          In <strong>Practice</strong>, you can map out situations, view saved entries and explore support plans. You can move between these spaces as needed.
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
