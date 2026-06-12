"use client";

import { onAuthStateChanged, User } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebase/client";
import { useAppStore } from "@/components/store";
import type { AppUser } from "@/lib/auth";
import type { Locale } from "@/lib/i18n";

type AuthState = {
  firebaseUser: User | null;
  user: AppUser | null;
  ready: boolean;
};

const AuthContext = createContext<AuthState>({ firebaseUser: null, user: null, ready: false });

export function AuthStateProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const user = useAppStore((s) => s.user);
  const setUser = useAppStore((s) => s.setUser);
  const setLocale = useAppStore((s) => s.setLocale);
  const locale = useAppStore((s) => s.locale);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (nextUser) => {
      setFirebaseUser(nextUser);
      if (!nextUser) {
        setUser(null);
        setReady(true);
        return;
      }

      try {
        const token = await nextUser.getIdToken();
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
        if (data.settings?.language === "en" || data.settings?.language === "hi") {
          setLocale(data.settings.language as Locale);
        }
      } finally {
        setReady(true);
      }
    });

    return () => unsub();
  }, [locale, setLocale, setUser]);

  return <AuthContext.Provider value={{ firebaseUser, user, ready }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
