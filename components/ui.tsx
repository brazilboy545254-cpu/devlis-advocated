"use client";

import { cn } from "@/lib/utils";

export function Button({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-white transition-all duration-200",
        "bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 shadow-glow",
        "hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(59,130,246,0.3)] active:translate-y-0 active:scale-[0.99]",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/90 backdrop-blur-xl",
        "transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/10 hover:text-white",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Card({
  className,
  children
}: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("rounded-[28px] border border-white/10 bg-white/8 p-5 shadow-2xl backdrop-blur-2xl", className)}>
      {children}
    </div>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20",
        props.className
      )}
    />
  );
}

export function Label({ children }: { children: React.ReactNode }) {
  return <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/45">{children}</div>;
}

export function Badge({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold text-cyan-200">{children}</span>;
}
