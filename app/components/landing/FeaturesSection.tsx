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
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-3">Trigger Journaling</h3>
          <p className="text-muted text-sm leading-relaxed flex-grow">
            Write down intrusive thoughts, physical sensations, or worries.
            Documenting triggers in a neutral workspace takes the intensity out
            of the spike.
          </p>
        </div>

        {/* Card 2 */}
        <div className="rounded-2xl border border-subtle bg-card p-8 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col h-full">
          <div className="w-12 h-12 rounded-xl bg-surface border border-subtle flex items-center justify-center text-accent mb-6">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 01-2 2h-2a2 2 0 01-2-2zm9-4V4a2 2 0 00-2-2h-2a2 2 0 00-2 2v11a2 2 0 002 2h2a2 2 0 002-2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-3">Pattern Recognition</h3>
          <p className="text-muted text-sm leading-relaxed flex-grow">
            CalmLoop connects the dots between separate entries to highlight
            recurring compulsion patterns, checking loops, and avoidant habits.
          </p>
        </div>

        {/* Card 3 */}
        <div className="rounded-2xl border border-subtle bg-card p-8 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col h-full">
          <div className="w-12 h-12 rounded-xl bg-surface border border-subtle flex items-center justify-center text-accent mb-6">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-3">Clinically Rooted Responses</h3>
          <p className="text-muted text-sm leading-relaxed flex-grow">
            Receive guidance focused on Response Prevention (ERP) and
            values-aligned action (ACT) so you can make active choices instead
            of anxiety-fueled reactions.
          </p>
        </div>
      </div>
    </section>
  );
}
