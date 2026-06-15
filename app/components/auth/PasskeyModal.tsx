"use client";
import { passkeySchema } from "@/app/utils/zod-schema";
import { useEffect, useRef, useState } from "react";
import { GoPasskeyFill } from "react-icons/go";
import { IoCloseOutline } from "react-icons/io5";
import { LuShieldCheck } from "react-icons/lu";
import { toast } from "sonner";

type PasskeyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: ({ name, email }: { name: string; email: string }) => Promise<void>;
  loading?: boolean;
};

export default function PasskeyModal({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
}: PasskeyModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => nameRef.current?.focus(), 50);
    } else {
      setName("");
      setEmail("");
      setErrors({});
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKey);

    return () => window.removeEventListener("keydown", handleKey);
  }, [loading, onClose]);

  async function handleSubmit() {
    const result = passkeySchema.safeParse({
      name: name.trim(),
      email: email.trim(),
    });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
      });
      return;
    }
    setErrors({});

    try {
      await onSubmit(result.data);
    } catch (err: any) {
      toast.error(err?.message ?? "Something went wrong");
    }
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl bg-card border border-subtle p-6 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="passkey-modal-title"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 rounded-lg p-1 text-muted hover:text-primary transition-colors disabled:opacity-30 cursor-pointer"
          aria-label="Close"
        >
          <IoCloseOutline size={20} />
        </button>

        {/* Icon + heading */}
        <div className="flex flex-col items-center mb-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <GoPasskeyFill size={24} />
          </div>
          <h2
            id="passkey-modal-title"
            className="text-lg font-semibold tracking-tight text-primary"
          >
            Set up your passkey
          </h2>
          <p className="mt-1 text-sm text-center text-muted">
            We&apos;ll link this passkey to your account.
          </p>
        </div>

        {/* Security Recommendation Banner */}
        <div className="mb-5 rounded-xl border border-warning-border bg-warning-bg p-3.5 flex gap-2.5 items-start">
          <LuShieldCheck
            size={16}
            className="text-warning-text shrink-0 mt-0.5"
          />
          <div className="flex flex-col gap-0.5 text-left">
            <span className="font-semibold text-[11px] text-warning-text leading-tight">
              Security Recommendations
            </span>
            <p className="text-[11px] leading-relaxed text-warning-text/90">
              Store your passkey in a secure password manager, add multiple
              passkeys for backup, and safely save your recovery code.
            </p>
          </div>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-4">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="passkey-name"
              className="text-xs font-medium text-primary"
            >
              Full name
            </label>
            <input
              id="passkey-name"
              ref={nameRef}
              type="text"
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name)
                  setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              disabled={loading}
              className={`input-base disabled:opacity-50 ${
                errors.name
                  ? "border-red-500 focus:shadow-[0_0_0_2px_rgba(239,68,68,0.3)]"
                  : ""
              }`}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="passkey-email"
              className="text-xs font-medium text-primary"
            >
              Email address
            </label>
            <input
              id="passkey-email"
              type="email"
              placeholder="jane@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email)
                  setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              disabled={loading}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className={`input-base disabled:opacity-50 ${
                errors.email
                  ? "border-red-500 focus:shadow-[0_0_0_2px_rgba(239,68,68,0.3)]"
                  : ""
              }`}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-2">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="cursor-pointer btn-accent flex w-full items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                Setting up…
              </>
            ) : (
              <>
                <GoPasskeyFill size={15} />
                Continue with Passkey
              </>
            )}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="cursor-pointer w-full rounded-lg py-2.5 text-sm font-medium text-muted hover:text-primary transition-colors disabled:opacity-30"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
