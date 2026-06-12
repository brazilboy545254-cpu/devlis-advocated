"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, History, Settings, Info, ShieldQuestion, House } from "lucide-react";
import { useAuth } from "@/components/use-auth";
import { LocaleToggle } from "@/components/locale-toggle";
import { LogoutButton } from "@/components/auth-button";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/components/store";

const nav = [
  { href: "/dashboard", icon: House, label: "Dashboard" },
  { href: "/history", icon: History, label: "History" },
  { href: "/settings", icon: Settings, label: "Settings" },
  { href: "/about", icon: Info, label: "About" },
  { href: "/privacy", icon: ShieldQuestion, label: "Privacy" }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const locale = useAppStore((s) => s.locale);

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.16),transparent_30%),linear-gradient(to_bottom,rgba(5,8,22,1),rgba(8,10,28,1))]" />
      <div className="mx-auto max-w-7xl px-4 pb-14 pt-5 sm:px-6 lg:px-8">
        <header className="sticky top-4 z-20 mb-6 rounded-[28px] border border-white/10 bg-white/[0.05] px-4 py-3 backdrop-blur-2xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-700 shadow-glow">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{locale === "en" ? "Devli's Advocated" : "देवलीज़ एडवोकेटेड"}</div>
                <div className="text-xs text-white/45">Google / Gmail only</div>
              </div>
            </Link>

            <nav className="flex flex-wrap items-center gap-2">
              {nav.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition-all",
                      active
                        ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-100"
                        : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              {user ? (
                <div className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70 md:block">
                  {user.name}
                </div>
              ) : null}
              <LocaleToggle />
              <LogoutButton />
            </div>
          </div>
        </header>

        <motion.main
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="space-y-6"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
