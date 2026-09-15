export default function CtaSection() {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-24 w-full">
      <div className="rounded-3xl border border-subtle bg-card p-10 text-center relative overflow-hidden shadow-xl">
        {/* Subtle inside glow */}
        <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-accent/10 blur-2xl pointer-events-none" />

        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
          A place to begin, or come back to.
        </h2>

        <p className="mt-4 text-muted text-base max-w-xl mx-auto">
          You can write a short entry or explore the practice tools. There is no need to do everything at once.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="/signup"
            className="btn-accent px-8 py-3 text-sm font-semibold rounded-lg"
          >
            Create a free account
          </a>
          <a
            href="/login"
            className="border border-subtle hover:bg-surface px-8 py-3 rounded-lg text-sm font-semibold text-primary transition-colors"
          >
            Sign in
          </a>
        </div>
      </div>
    </section>
  );
}
