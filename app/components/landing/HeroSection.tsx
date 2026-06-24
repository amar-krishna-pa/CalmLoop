export default function HeroSection() {
  return (
    <section className="mx-auto flex max-w-5xl flex-col items-center px-6 pt-20 pb-16 text-center">
      {/* Shimmer Badge */}
      <div className="mb-6 rounded-full border border-subtle bg-surface px-4 py-1.5 text-xs font-semibold text-muted tracking-wide flex items-center gap-2 hover:scale-[1.02] transition-transform duration-300">
        <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        AI-powered companion for OCD & Anxiety
      </div>

      <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight md:text-7xl lg:text-8xl leading-tight">
        Break the loop.
        <br />
        <span className="text-accent">Respond differently.</span>
      </h1>

      <p className="mt-8 max-w-2xl text-base md:text-lg text-muted font-normal leading-relaxed">
        CalmLoop helps you recognize OCD and anxiety patterns, reflect on them through guided AI conversations, and practice response prevention using ERP and ACT guidelines.
      </p>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row items-center justify-center w-full">
        <a
          href="/signup"
          className="btn-accent flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          Start Reflecting — Free
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </a>

        <a
          href="#how-it-works"
          className="flex items-center justify-center gap-2 border border-subtle hover:bg-surface px-6 py-3 rounded-lg text-sm font-semibold text-primary transition-colors"
        >
          How it works
        </a>
      </div>

      <p className="text-xs text-muted mt-5">
        No credit card required. Fully encrypted & secure.
      </p>
    </section>
  );
}
