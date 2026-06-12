"use client";

import { useAppStore } from "@/components/store";
import { GhostButton } from "@/components/ui";

export function LocaleToggle() {
  const locale = useAppStore((s) => s.locale);
  const setLocale = useAppStore((s) => s.setLocale);

  return (
    <GhostButton
      onClick={() => setLocale(locale === "en" ? "hi" : "en")}
      className="min-w-24 justify-center"
    >
      {locale === "en" ? "हिंदी" : "English"}
    </GhostButton>
  );
}
