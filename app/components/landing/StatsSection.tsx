export default function StatsSection() {
  return (
    <section className="border-y border-subtle bg-surface/20 py-12 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div className="flex flex-col items-center">
            <span className="text-4xl font-extrabold text-accent">3 in 4</span>
            <span className="text-xs text-muted mt-2 max-w-[180px]">
              users reported increased tolerance to intrusive spikes after 3 weeks
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl font-extrabold text-accent">100%</span>
            <span className="text-xs text-muted mt-2 max-w-[180px]">
              private, local-first encrypted entries — we never see your data
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl font-extrabold text-accent">ERP + ACT</span>
            <span className="text-xs text-muted mt-2 max-w-[180px]">
              guided tools built strictly on exposure & values-aligned action
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl font-extrabold text-accent">24/7</span>
            <span className="text-xs text-muted mt-2 max-w-[180px]">
              on-demand reflection templates whenever triggers arise
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
