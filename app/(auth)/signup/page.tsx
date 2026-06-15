"use client";
import { GoPasskeyFill } from "react-icons/go";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaGoogle } from "react-icons/fa";
import AuthButton from "@/app/components/auth/AuthButton";
import AuthHeroPanel from "@/app/components/auth/AuthHeroPanel";
import { authClient } from "@/app/lib/auth-client";
import PasskeyModal from "@/app/components/auth/PasskeyModal";

export default function SignUpPage() {
  const [loading, setLoading] = useState<"google" | "passkey" | null>(null);
  const [passkeyModalOpen, setPasskeyModalOpen] = useState(false);

  const router = useRouter();

  async function handleGoogleSignup() {
    setLoading("google");
    try {
      const { data, error } = await authClient.signIn.social({
        provider: "google",
      });
      if (error) {
        console.error(error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(null);
    }
  }

  async function handlePasskeySubmit({
    name,
    email,
  }: {
    name: string;
    email: string;
  }) {
    setLoading("passkey");

    try {
      const { error } = await authClient.passkey.addPasskey({
        name: `${name}'s passkey`,
        authenticatorAttachment: "platform",
        context: JSON.stringify({ name, email }),
      });

      if (error) {
        throw new Error("Passkey setup was cancelled.");
      }

      const session = await authClient.getSession();
      if (!session.data) {
        await authClient.signIn.passkey({
          fetchOptions: {
            onError: (ctx) =>
              console.error("Auto sign-in failed:", ctx.error.message),
          },
        });
      }

      setPasskeyModalOpen(false);
      router.push("/dashboard");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="h-full flex">
      <AuthHeroPanel />

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold tracking-tight mb-1 text-center">
            Create your account
          </h1>

          <p className="text-sm text-muted mb-8 text-center">
            Start journaling for free. No credit card required.
          </p>

          <div className="flex flex-col gap-3 mb-6 items-center justify-center">
            <AuthButton
              handleClick={handleGoogleSignup}
              loading={loading}
              method="google"
              icon={<FaGoogle />}
              text="Continue with Google"
            />
            <AuthButton
              handleClick={() => setPasskeyModalOpen(true)}
              loading={loading}
              method="passkey"
              icon={<GoPasskeyFill />}
              text="Continue with Passkey"
            />
          </div>

          <p className="text-xs text-muted text-center mt-6">
            Already have an account?
            <Link href="/login">
              &nbsp;
              <span className="text-accent hover:underline font-medium">
                Sign in
              </span>
            </Link>
          </p>

          <p className="text-[11px] text-muted text-center mt-4 leading-relaxed">
            By creating an account you agree to our &nbsp;
            <Link href="#" className="underline hover:text-primary">
              Terms of Service
            </Link>
            &nbsp; and &nbsp;
            <Link href="#" className="underline hover:text-primary">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>

      <PasskeyModal
        isOpen={passkeyModalOpen}
        onClose={() => {
          if (!loading) setPasskeyModalOpen(false);
        }}
        onSubmit={handlePasskeySubmit}
        loading={loading === "passkey"}
      />
    </div>
  );
}
