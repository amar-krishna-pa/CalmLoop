const stats = [
  {
    value: "Practice",
    detail: "tools for exploring your responses to uncertainty",
  },
  {
    value: "Reflection",
    detail: "space to describe what comes up in your own words",
  },
  {
    value: "Small steps",
    detail: "one entry can be a starting point",
  },
  {
    value: "Your pace",
    detail: "you can return when it is useful to you",
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
