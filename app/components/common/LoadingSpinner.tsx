export default function LoadingSpinner({ size = 20 }: { size?: number }) {
  return (
    <svg
      className="animate-spin text-muted"
      width={size}
      height={size}
      viewBox="0 0 50 50"
      fill="none"
    >
      <circle
        cx="25"
        cy="25"
        r="20"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="90 150"
        className="opacity-80"
      />
    </svg>
  );
}
