"use client";
import Link from "next/link";
import { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import AuthButton from "@/app/components/auth/AuthButton";
import AuthHeroPanel from "@/app/components/auth/AuthHeroPanel";
import { authClient } from "@/app/lib/auth/auth-client";
import { toast } from "sonner";

export default function SignUpPage() {
  const [loading, setLoading] = useState<"google" | null>(null);

  async function handleGoogleSignup() {
    setLoading("google");

    try {
      const { error } = await authClient.signIn.social({ provider: "google" });
      if (error) {
        toast.error("Failed to sign up with Google");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to sign up with Google");
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
            Start your practice for free. No credit card required.
          </p>

          <div className="flex flex-col gap-3 mb-6 items-center justify-center">
            <AuthButton
              handleClick={handleGoogleSignup}
              loading={loading}
              method="google"
              icon={<FaGoogle />}
              text="Continue with Google"
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

          <p className="text-caption text-muted text-center mt-4 leading-relaxed">
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
    </div>
  );
}
