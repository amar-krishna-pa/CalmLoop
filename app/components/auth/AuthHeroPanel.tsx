export default function AuthHeroPanel() {
  return (
    <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-surface border-r border-subtle relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-accent/20 blur-3xl pointer-events-none" />

      <div className="absolute inset-0 flex items-center justify-center px-12 z-10">
        <div className="max-w-md">
          <blockquote className="text-2xl font-bold tracking-tight leading-snug mb-4">
            "You don't need certainty to move forward."
          </blockquote>
          <p className="text-sm text-muted">
            — Grounded in Exposure & Response Prevention (ERP) and Acceptance &
            Commitment Therapy (ACT).
          </p>
        </div>
      </div>
    </div>
  );
}
