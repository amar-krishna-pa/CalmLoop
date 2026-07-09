export default function AnxietyDot({ level }: { level: number }) {
  const color =
    level <= 3 ? "bg-success" : level <= 6 ? "bg-warning-text" : "bg-danger";

  return (
    <span
      className={`inline-block w-2 h-2 rounded-full ${color} shrink-0 mt-1.5`}
    />
  );
}
