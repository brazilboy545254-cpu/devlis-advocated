"use client";

import { AppShell } from "@/components/app-shell";
import { HistoryList } from "@/components/history-list";
import { useAuth } from "@/components/use-auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HistoryPage() {
  const { firebaseUser, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && !firebaseUser) router.replace("/login");
  }, [firebaseUser, ready, router]);

  return (
    <AppShell>
      <div>
        <h1 className="text-3xl font-bold text-white">History</h1>
        <p className="mt-2 text-sm text-white/55">Previous creations stored in Supabase.</p>
      </div>
      <HistoryList />
    </AppShell>
  );
}
