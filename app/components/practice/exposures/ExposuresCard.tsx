export default function ExposuresCard() {
  return (
    <section
      aria-labelledby="exposures-heading"
      className="card-medium exposures-card-height flex flex-col gap-4 rounded-xl border border-subtle bg-card p-4"
    >
      <h2 id="exposures-heading" className="text-sm font-semibold text-primary">
        Exposure practice
      </h2>
      <div className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto">
        <p className="max-w-sm text-center text-sm text-muted">
          This section is being rebuilt. Exposure task creation is not available
          yet.
        </p>
      </div>
    </section>
  );
}
