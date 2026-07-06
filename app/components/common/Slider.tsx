type Props = {
  value: number;
  editable: boolean;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  ariaLabel?: string;
};

export default function Slider({
  value,
  editable,
  onChange,
  min = 0,
  max = 10,
  step = 1,
  ariaLabel,
}: Props) {
  const sudsColor = (value: number) => {
    const clamped = Math.max(0, Math.min(10, value));
    if (clamped <= 5) {
      const pct = Math.round((clamped / 5) * 100);
      return `color-mix(in srgb, var(--caution) ${pct}%, var(--success) ${
        100 - pct
      }%)`;
    }
    const pct = Math.round(((clamped - 5) / 5) * 100);
    return `color-mix(in srgb, var(--danger) ${pct}%, var(--caution) ${
      100 - pct
    }%)`;
  };

  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange?.(Number(e.target.value))}
      readOnly={!editable}
      aria-label={ariaLabel}
      className={`flex-1 ${editable ? "cursor-pointer" : "cursor-default pointer-events-none opacity-50"}`}
      style={{ accentColor: sudsColor(value) }}
    />
  );
}
