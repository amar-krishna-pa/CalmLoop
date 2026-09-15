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
    title: "A place to check in",
    description:
      "A view of mood, sleep, stress and medication. These tools are being developed; some cards show examples.",
  },
  {
    icon: LuClipboardList,
    label: "Practice",
    title: "Tools for practice",
    description:
      "Describe situations that bring up anxiety and save them for practice. You can begin with one.",
  },
  {
    icon: LuMessageSquare,
    label: "Chat",
    title: "AI reflection",
    description:
      "Space to talk about what is coming up and consider a next step. AI responses can make mistakes.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mb-16 text-center max-w-3xl mx-auto">
        <span className="text-xs font-semibold uppercase tracking-widest text-accent">
          At your pace
        </span>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mt-3">
          Space to reflect
        </h2>
        <p className="mt-4 text-muted text-base">
          You can explore what matters to you without needing to settle every doubt.
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
              <span className="text-2xs font-semibold uppercase tracking-widest text-muted border border-subtle rounded-full px-2.5 py-1">
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
