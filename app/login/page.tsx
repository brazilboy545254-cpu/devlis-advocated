"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LoginButton, SignInMethodBadge } from "@/components/auth-button";
import { Card } from "@/components/ui";
import { auth } from "@/lib/firebase/client";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    if (auth.currentUser) router.replace("/dashboard");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#050816] px-4 py-8 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center">
        <Card className="grid w-full gap-8 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_35%),linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-8">
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute right-8 top-8 h-20 w-20 rounded-full bg-cyan-400/10 blur-2xl" />
            <div className="relative">
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/80">Devli's Advocated</p>
              <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
                Your Original QR Photo
              </h1>
              <p className="mt-4 max-w-md text-sm leading-7 text-white/65">
                Sign in with Google only, create a stylish QR image on the client, and keep your history synced to Supabase.
              </p>
              <div className="mt-6">
                <SignInMethodBadge />
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-5 p-2 sm:p-4">
            <div>
              <p className="text-sm font-medium text-white/60">Secure access</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Continue with Google / Gmail</h2>
              <p className="mt-2 text-sm text-white/50">No password sign-up, no guest mode.</p>
            </div>
            <LoginButton />
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-6 text-white/60">
              By continuing, you agree to the app’s Privacy Policy and Terms & Conditions. Legal pages are available in the footer and navigation.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
