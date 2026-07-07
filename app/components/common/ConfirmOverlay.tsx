import LoadingSpinner from "@/app/components/loaders/LoadingSpinner";

type Props = {
  message: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmOverlay({
  message,
  loading = false,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <div className="absolute inset-0 z-10 rounded-lg bg-card/95 backdrop-blur-sm border border-subtle flex flex-col items-center justify-center gap-3 px-3">
      <p className="text-xs text-primary">{message}</p>

      <div className="flex items-center gap-5 shrink-0">
        <button
          onClick={onCancel}
          disabled={loading}
          className="cursor-pointer px-2.5 py-1 rounded-lg text-xs text-primary border border-black/20 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>

        <button
          onClick={onConfirm}
          disabled={loading}
          className="cursor-pointer px-2.5 py-1 rounded-lg text-xs text-on-accent bg-danger hover:opacity-90 transition-opacity flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading && <LoadingSpinner size={12} />}
          Delete
        </button>
      </div>
    </div>
  );
}
