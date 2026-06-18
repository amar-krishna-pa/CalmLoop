export default function LoadingSpinner({ size = 16 }: { size?: number }) {
  return (
    <span
      className="block animate-spin rounded-full border-2 border-current border-t-transparent"
      style={{ width: size, height: size }}
      aria-label="Loading"
      role="status"
    />
  );
}
