function sudsColor(value: number): string {
  const clamped = Math.max(0, Math.min(10, value));
  if (clamped <= 5) {
    const pct = Math.round((clamped / 5) * 100);
    return `color-mix(in srgb, var(--caution) ${pct}%, var(--success) ${100 - pct}%)`;
  }
  const pct = Math.round(((clamped - 5) / 5) * 100);
  return `color-mix(in srgb, var(--danger) ${pct}%, var(--caution) ${100 - pct}%)`;
}

export default function AnxietyBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-16 bg-card rounded-full h-1.5">
        <div
          className="rounded-full h-1.5 transition-all"
          style={{
            width: `${(value / 10) * 100}%`,
            backgroundColor: sudsColor(value),
          }}
        />
      </div>
      <span className="text-xs text-muted">{value}/10</span>
    </div>
  );
}
