import { IoIosJournal } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { LuShieldCheck } from "react-icons/lu";

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
          Compulsions seek reassurance, which feeds anxiety. CalmLoop helps you
          lean into uncertainty and build permanent resilience.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Card 1 */}
        <div className="rounded-2xl border border-subtle bg-card p-8 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col h-full">
          <div className="w-12 h-12 rounded-xl bg-surface border border-subtle flex items-center justify-center text-accent mb-6">
            <IoIosJournal size={24} />
          </div>
          <h3 className="text-xl font-bold mb-3">Trigger Journaling</h3>
          <p className="text-muted text-sm leading-relaxed grow">
            Write down intrusive thoughts, physical sensations, or worries.
            Documenting triggers in a neutral workspace takes the intensity out
            of the spike.
          </p>
        </div>

        {/* Card 2 */}
        <div className="rounded-2xl border border-subtle bg-card p-8 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col h-full">
          <div className="w-12 h-12 rounded-xl bg-surface border border-subtle flex items-center justify-center text-accent mb-6">
            <FaSearch size={24} />
          </div>
          <h3 className="text-xl font-bold mb-3">Pattern Recognition</h3>
          <p className="text-muted text-sm leading-relaxed grow">
            CalmLoop connects the dots between separate entries to highlight
            recurring compulsion patterns, checking loops, and avoidant habits.
          </p>
        </div>

        {/* Card 3 */}
        <div className="rounded-2xl border border-subtle bg-card p-8 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col h-full">
          <div className="w-12 h-12 rounded-xl bg-surface border border-subtle flex items-center justify-center text-accent mb-6">
            <LuShieldCheck size={24} />
          </div>
          <h3 className="text-xl font-bold mb-3">
            Clinically Rooted Responses
          </h3>
          <p className="text-muted text-sm leading-relaxed grow">
            Receive guidance focused on Response Prevention (ERP) and
            values-aligned action (ACT) so you can make active choices instead
            of anxiety-fueled reactions.
          </p>
        </div>
      </div>
    </section>
  );
}
