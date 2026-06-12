"use client";

import { motion } from "framer-motion";

export function SplashScreen() {
  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#050816]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.18),transparent_25%)]" />
      <motion.div
        className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      <div className="relative flex h-full items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <motion.div
            animate={{ rotateY: [0, 10, 0], rotateX: [0, -6, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-[28px] border border-white/10 bg-white/5 shadow-glow backdrop-blur-xl"
          >
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600" />
          </motion.div>
          <motion.h1
            className="bg-gradient-to-r from-white via-cyan-100 to-indigo-200 bg-clip-text text-4xl font-black text-transparent sm:text-6xl"
            animate={{ filter: ["drop-shadow(0 0 0px rgba(34,211,238,0.0))", "drop-shadow(0 0 16px rgba(34,211,238,0.5))", "drop-shadow(0 0 0px rgba(34,211,238,0.0))"] }}
            transition={{ duration: 3.5, repeat: Infinity }}
          >
            Your Original QR Photo
          </motion.h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/70 sm:text-base">
            A premium QR workflow with a glassmorphism dashboard, Google-only login, and a lightweight client-side conversion pass.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
