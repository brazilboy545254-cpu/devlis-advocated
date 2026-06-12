import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 0 0 1px rgba(125, 211, 252, 0.18), 0 10px 40px rgba(8, 145, 178, 0.18), 0 0 80px rgba(99, 102, 241, 0.12)"
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0px) translateX(0px)" },
          "50%": { transform: "translateY(-10px) translateX(6px)" }
        },
        pulseGlow: {
          "0%,100%": { opacity: "0.65", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" }
        }
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        pulseGlow: "pulseGlow 5s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
