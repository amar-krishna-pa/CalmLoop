"use client";

import { GoPasskeyFill } from "react-icons/go";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaGoogle } from "react-icons/fa";
import AuthButton from "@/app/components/auth/AuthButton";
import AuthHeroPanel from "@/app/components/auth/AuthHeroPanel";
import { authClient } from "@/app/lib/auth/auth-client";
import { toast } from "sonner";

export default function LoginPage() {
  const [loading, setLoading] = useState<"google" | "passkey" | null>(null);

  const router = useRouter();

  async function handleGoogleLogin() {
    setLoading("google");

    try {
      const { error } = await authClient.signIn.social({ provider: "google" });
      if (error) toast.error("Failed to sign in with Google");
    } catch (err) {
      console.error(err);
      toast.error("Failed to sign in with Google");
    } finally {
      setLoading(null);
    }
  }

  async function handlePasskeyLogin() {
    setLoading("passkey");

    try {
      const { error } = await authClient.signIn.passkey();
      if (error) {
        toast.error("Failed to sign in with Passkey");
      } else {
        router.push("/today");
        router.refresh();
      }
    } catch (err) {
      if (err instanceof Error && err.name === "NotAllowedError") return;
      console.error(err);
      toast.error("Failed to sign in with Passkey");
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
            Welcome back
          </h1>

          <p className="text-sm text-muted mb-8 text-center">
            Sign in to continue your practice.
          </p>

          <div className="flex flex-col gap-3 mb-6 items-center justify-center">
            <AuthButton
              handleClick={handleGoogleLogin}
              loading={loading}
              method="google"
              icon={<FaGoogle />}
              text="Continue with Google"
            />
            <AuthButton
              handleClick={handlePasskeyLogin}
              loading={loading}
              method="passkey"
              icon={<GoPasskeyFill />}
              text="Sign in with Passkey"
            />
          </div>

          <p className="text-xs text-muted text-center mt-6">
            Don&apos;t have an account?
            <Link href="/signup">
              &nbsp;
              <span className="text-accent hover:underline font-medium">
                Sign up
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
