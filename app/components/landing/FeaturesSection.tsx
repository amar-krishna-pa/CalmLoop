import {
  LuSunMedium,
  LuClipboardList,
  LuBookOpen,
  LuLifeBuoy,
  LuNotebookPen,
  LuMessageSquare,
} from "react-icons/lu";

type Feature = {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  title: string;
  description: string;
  tags: string[];
};

const features: Feature[] = [
  {
    icon: LuSunMedium,
    label: "Today",
    title: "Daily Check-in Dashboard",
    description:
      "Anchor your day with a structured wellness snapshot before OCD has a chance to escalate.",
    tags: [
      "Mood tracker",
      "Sleep & stress log",
      "Medication adherence",
      "Progress streak",
      "Daily ERP quote",
    ],
  },
  {
    icon: LuClipboardList,
    label: "Treatment",
    title: "Full ERP Treatment Toolkit",
    description:
      "Structured across three phases — Prepare, Practice, and Plan — so each step builds on the last.",
    tags: [
      "Fear hierarchy + SUDS",
      "ERP tracker",
      "Thought records",
      "Behavioural experiments",
      "Relapse prevention",
    ],
  },
  {
    icon: LuBookOpen,
    label: "Learn",
    title: "OCD Psychoeducation",
    description:
      "Understand the mechanics behind your anxiety so you can stop being surprised by it.",
    tags: [
      "6-step OCD cycle",
      "Cognitive distortions",
      "Thought-action fusion",
      "Uncertainty intolerance",
    ],
  },
  {
    icon: LuLifeBuoy,
    label: "Support",
    title: "Crisis & Grounding Tools",
    description:
      "When a spike hits, reach for a grounding technique or open the AI chat — no reassurance given.",
    tags: [
      "5-4-3-2-1 senses",
      "Box breathing",
      "Body scan",
      "Safe place",
      "Muscle relax",
    ],
  },
  {
    icon: LuNotebookPen,
    label: "Reflect",
    title: "Journal & Subtype Insights",
    description:
      "Write freely, then see which OCD themes recur across your entries over the past 30 days.",
    tags: [
      "Free-form journal",
      "Contamination",
      "Harm OCD",
      "Pure O",
      "Checking",
      "Symmetry",
    ],
  },
  {
    icon: LuMessageSquare,
    label: "Chat",
    title: "AI Reflection Assistant",
    description:
      "A persistent, session-aware AI that responds with ERP and ACT guidance — never reassurance.",
    tags: [
      "Session history",
      "Editable titles",
      "ERP-grounded responses",
      "24/7 access",
    ],
  },
];

export default function FeaturesSection() {
  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mb-16 text-center max-w-3xl mx-auto">
        <span className="text-xs font-semibold uppercase tracking-widest text-accent">
          Everything you need
        </span>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mt-3">
          A complete toolkit for breaking the loop
        </h2>
        <p className="mt-4 text-muted text-base">
          Six focused areas — each grounded in ERP and ACT — that work together
          from daily check-in to long-term recovery planning.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ icon: Icon, label, title, description, tags }) => (
          <div
            key={title}
            className="rounded-2xl border border-subtle bg-card p-8 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col h-full"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-xl bg-surface border border-subtle flex items-center justify-center text-accent">
                <Icon size={22} />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted border border-subtle rounded-full px-2.5 py-1">
                {label}
              </span>
            </div>
            <h3 className="text-lg font-bold mb-2">{title}</h3>
            <p className="text-muted text-sm leading-relaxed grow mb-5">
              {description}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] bg-surface border border-subtle px-2 py-0.5 rounded-full text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
