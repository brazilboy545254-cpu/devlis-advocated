"use client";

import { useEffect } from "react";
import { Toaster } from "sonner";
import { useAppStore } from "@/components/store";

export function Providers({ children }: { children: React.ReactNode }) {
  const hydrate = useAppStore((s) => s.hydrate);
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <>
      {children}
      <Toaster richColors closeButton position="top-right" />
    </>
  );
}
