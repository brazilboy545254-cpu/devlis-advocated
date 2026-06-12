"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useMemo, useRef } from "react";
import { cn } from "@/lib/utils";

export function TiltCard({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rx = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 200, damping: 18 });
  const ry = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 200, damping: 18 });

  const glow = useMemo(
    () => "radial-gradient(circle at var(--x) var(--y), rgba(34,211,238,0.18), transparent 35%)",
    []
  );

  return (
    <motion.div
      ref={ref}
      className={cn("relative transform-gpu", className)}
      style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        x.set(px);
        y.set(py);
        if (ref.current) {
          ref.current.style.setProperty("--x", `${e.clientX - rect.left}px`);
          ref.current.style.setProperty("--y", `${e.clientY - rect.top}px`);
        }
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-[28px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: glow }}
      />
      {children}
    </motion.div>
  );
}
