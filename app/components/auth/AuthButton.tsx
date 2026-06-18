import LoadingSpinner from "../loaders/LoadingSpinner";

type AuthButtonProps = {
  handleClick: () => void | Promise<void>;
  loading: string | null;
  method: "google" | "passkey";
  icon: React.ReactNode;
  text: string;
};

export default function AuthButton({
  handleClick,
  loading,
  method,
  icon,
  text,
}: AuthButtonProps) {
  return (
    <button
      onClick={handleClick}
      disabled={loading !== null}
      className="w-80 border border-subtle bg-card hover:bg-surface rounded-lg px-4 py-2.5 text-sm font-medium text-primary flex justify-center cursor-pointer"
    >
      <div className="w-50 grid grid-cols-[20px_1fr] items-center gap-3 ml-10">
        <span className="w-5 h-5 flex items-center justify-center">
          {loading == method ? <LoadingSpinner /> : icon}
        </span>

        <span className="text-left leading-none">{text}</span>
      </div>
    </button>
  );
}
