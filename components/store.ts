"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppUser, HistoryItem } from "@/lib/auth";
import type { Locale } from "@/lib/i18n";

type AppState = {
  locale: Locale;
  user: AppUser | null;
  history: HistoryItem[];
  loading: boolean;
  hydrated: boolean;
  setLocale: (locale: Locale) => void;
  setUser: (user: AppUser | null) => void;
  setHistory: (history: HistoryItem[]) => void;
  setLoading: (loading: boolean) => void;
  hydrate: () => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      locale: "en",
      user: null,
      history: [],
      loading: false,
      hydrated: false,
      setLocale: (locale) => set({ locale }),
      setUser: (user) => set({ user }),
      setHistory: (history) => set({ history }),
      setLoading: (loading) => set({ loading }),
      hydrate: () => set({ hydrated: true })
    }),
    {
      name: "devlis-advocated",
      partialize: (state) => ({ locale: state.locale, user: state.user })
    }
  )
);
