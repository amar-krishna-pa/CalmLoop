const stats = [
  {
    value: "ERP + ACT",
    detail: "built strictly on the two evidence-based frameworks for OCD and anxiety",
  },
  {
    value: "100%",
    detail: "yours — your entries are never sold, shared, or used to train AI models",
  },
  {
    value: "0",
    detail: "reassurance given — every response is designed to build tolerance, not reduce it",
  },
  {
    value: "24/7",
    detail: "available whenever a spike hits, not just during office hours",
  },
];

export default function StatsSection() {
  return (
    <section className="border-y border-subtle bg-surface/20 py-12 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map(({ value, detail }) => (
            <div key={value} className="flex flex-col items-center">
              <span className="text-4xl font-extrabold text-accent">{value}</span>
              <span className="text-xs text-muted mt-2 max-w-[180px]">{detail}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
