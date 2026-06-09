export default function PhilosophySection() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <div className="rounded-3xl border border-subtle bg-surface/30 p-8 md:p-12">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">
              The Philosophy
            </span>
            <h2 className="text-3xl font-bold tracking-tight mt-3">
              Understanding the Loop
            </h2>
            <p className="mt-4 text-muted text-sm leading-relaxed">
              Traditional journaling often encourages venting, which can lead to
              reassurance-seeking or over-analyzing intrusive thoughts. CalmLoop
              teaches your brain to treat thoughts as just thoughts, allowing you
              to focus your energy back on your life values.
            </p>
          </div>

          <div className="space-y-4">
            <div className="border border-subtle rounded-xl bg-card p-4 flex gap-4 items-start">
              <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                ✕
              </div>
              <div>
                <h4 className="font-bold text-sm">Reassurance & Checking</h4>
                <p className="text-xs text-muted mt-1">
                  Gives temporary safety but feeds the anxiety loop, causing
                  spikes to return faster and more intensely.
                </p>
              </div>
            </div>

            <div className="border border-accent/20 rounded-xl bg-accent/5 dark:bg-accent/10 p-4 flex gap-4 items-start">
              <div className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center flex-shrink-0 text-xs font-bold">
                ✓
              </div>
              <div>
                <h4 className="font-bold text-sm text-accent">
                  Uncertainty Tolerance
                </h4>
                <p className="text-xs text-muted mt-1">
                  Accepting uncertainty allows the anxious spike to peak and
                  naturally decay, desensitizing your brain.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
