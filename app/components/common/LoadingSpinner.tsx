import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function LoadingSpinner({ size = 20 }: { size?: number }) {
  return (
    <AiOutlineLoading3Quarters
      className="animate-spin text-muted opacity-80"
      size={size}
    />
  );
}
