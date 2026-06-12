"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SplashScreen } from "@/components/splash-screen";
import { auth } from "@/lib/firebase/client";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace(auth.currentUser ? "/dashboard" : "/login");
    }, 2200);
    return () => clearTimeout(timer);
  }, [router]);

  return <SplashScreen />;
}
