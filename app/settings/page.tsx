"use client";

import { AppShell } from "@/components/app-shell";
import { SettingsPanel } from "@/components/settings-panel";
import { useAuth } from "@/components/use-auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { firebaseUser, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && !firebaseUser) router.replace("/login");
  }, [firebaseUser, ready, router]);

  return (
    <AppShell>
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="mt-2 text-sm text-white/55">Manage your profile, language, and account actions.</p>
      </div>
      <SettingsPanel />
    </AppShell>
  );
}
