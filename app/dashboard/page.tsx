"use client";

import { AppShell } from "@/components/app-shell";
import { useAuth } from "@/components/use-auth";
import { Card } from "@/components/ui";
import { QrWorkflow } from "@/components/qr-workflow";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/components/store";

export default function DashboardPage() {
  const { firebaseUser, ready, user } = useAuth();
  const router = useRouter();
  const locale = useAppStore((s) => s.locale);

  useEffect(() => {
    if (ready && !firebaseUser) router.replace("/login");
  }, [firebaseUser, ready, router]);

  if (!ready) {
    return <div className="min-h-screen bg-[#050816] p-6 text-white">Loading...</div>;
  }

  return (
    <AppShell>
      <div className="grid gap-5">
        <Card className="overflow-hidden">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/70">{locale === "en" ? "Welcome back" : "फिर से स्वागत है"}</p>
              <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
                {user?.name || "Google User"}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
                Upload the original QR image and the style reference, then generate a polished PNG output with a client-side conversion pass.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
              Signed in with <span className="font-semibold text-white">Google / Gmail</span>
            </div>
          </div>
        </Card>

        <QrWorkflow />
      </div>
    </AppShell>
  );
}
