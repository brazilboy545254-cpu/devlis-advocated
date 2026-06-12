"use client";

import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAppStore } from "@/components/store";
import type { Locale } from "@/lib/i18n";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const setUser = useAppStore((s) => s.setUser);
  const locale = useAppStore((s) => s.locale);
  const setLocale = useAppStore((s) => s.setLocale);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (!firebaseUser) {
          setUser(null);
          setReady(true);
          return;
        }

        const token = await firebaseUser.getIdToken();
        const res = await fetch("/api/auth/sync", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ locale })
        });

        if (!res.ok) throw new Error(await res.text());

        const data = await res.json();
        setUser(data.user);
        if (data.settings?.language) setLocale(data.settings.language as Locale);
        setReady(true);
      } catch (error) {
        console.error(error);
        toast.error("Authentication sync failed.");
        setReady(true);
      }
    });

    return () => unsub();
  }, [locale, setLocale, setUser]);

  useEffect(() => {
    const stored = localStorage.getItem("devlis-lang");
    if (stored === "en" || stored === "hi") setLocale(stored);
  }, [setLocale]);

  useEffect(() => {
    localStorage.setItem("devlis-lang", locale);
    fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language: locale }).catch?.(() => null)
    }).catch(() => undefined);
  }, [locale]);

  useEffect(() => {
    if (!ready) return;
    const current = auth.currentUser;
    if (!current && window.location.pathname.startsWith("/dashboard")) {
      router.replace("/login");
    }
  }, [ready, router]);

  return <>{children}</>;
}
