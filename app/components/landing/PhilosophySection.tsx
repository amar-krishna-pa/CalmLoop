export default function PhilosophySection() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <div className="rounded-3xl border border-subtle bg-surface/30 p-8 md:p-12">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">
              Our approach
            </span>
            <h2 className="text-3xl font-bold tracking-tight mt-3">
              Understanding the loop
            </h2>
            <p className="mt-4 text-muted text-sm leading-relaxed">
              OCD can bring a strong urge to resolve a doubt. CalmLoop offers space to notice that urge and consider what you want to do next.
            </p>
          </div>

          <div className="space-y-4">
            <div className="border border-subtle rounded-xl bg-card p-4 flex gap-4 items-start">
              <div className="w-6 h-6 rounded-full bg-warning-bg text-warning-text flex items-center justify-center flex-shrink-0 text-xs font-bold">
                ✕
              </div>
              <div>
                <h4 className="font-bold text-sm">Repeated checking</h4>
                <p className="text-xs text-muted mt-1">
                  Checking or asking for reassurance may bring brief relief. The doubt can return.
                </p>
              </div>
            </div>

            <div className="border border-accent/20 rounded-xl bg-accent/5 dark:bg-accent/10 p-4 flex gap-4 items-start">
              <div className="w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center flex-shrink-0 text-xs font-bold">
                ✓
              </div>
              <div>
                <h4 className="font-bold text-sm text-accent">
                  Making room for uncertainty
                </h4>
                <p className="text-xs text-muted mt-1">
                  Practice can involve leaving a doubt unresolved while doing something that matters to you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
