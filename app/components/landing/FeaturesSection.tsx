import { LuSunMedium, LuClipboardList, LuMessageSquare } from "react-icons/lu";

type Feature = {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    icon: LuSunMedium,
    label: "Today",
    title: "Daily Check-in",
    description:
      "Track your mood, sleep, stress, and medication each day. A consistent check-in builds the self-awareness that makes ERP work.",
  },
  {
    icon: LuClipboardList,
    label: "Treatment",
    title: "Structured ERP Tools",
    description:
      "Map your fear hierarchy, log exposures, challenge intrusive thoughts, and plan for setbacks — all grounded in ERP and ACT.",
  },
  {
    icon: LuMessageSquare,
    label: "Chat",
    title: "AI Reflection Assistant",
    description:
      "An AI companion that responds with ERP and ACT-grounded guidance whenever anxiety spikes — not reassurance, but honest support.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mb-16 text-center max-w-3xl mx-auto">
        <span className="text-xs font-semibold uppercase tracking-widest text-accent">
          Built for growth
        </span>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mt-3">
          Designed for reflection, not reassurance
        </h2>
        <p className="mt-4 text-muted text-base">
          Compulsions seek certainty, which feeds the loop. CalmLoop helps you
          lean into uncertainty and build lasting resilience.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {features.map(({ icon: Icon, label, title, description }) => (
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
            <h3 className="text-xl font-bold mb-3">{title}</h3>
            <p className="text-muted text-sm leading-relaxed grow">
              {description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
