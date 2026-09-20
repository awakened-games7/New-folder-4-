import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        system: {
          blue: "#00f0ff",
          deepBlue: "#0055ff",
          darkNavy: "#050b14",
          panelBg: "rgba(6, 14, 28, 0.75)",
          panelBorder: "rgba(0, 240, 255, 0.4)",
          glow: "rgba(0, 240, 255, 0.6)",
          shadowPurple: "#7928ca",
          dangerRed: "#ff3366",
          goldRank: "#fbbf24",
        },
      },
      fontFamily: {
        orbitron: ["var(--font-orbitron)", "monospace"],
        rajdhani: ["var(--font-rajdhani)", "sans-serif"],
        jetbrains: ["var(--font-jetbrains)", "monospace"],
      },
      boxShadow: {
        "neon-blue": "0 0 15px rgba(0, 240, 255, 0.35), inset 0 0 10px rgba(0, 240, 255, 0.1)",
        "neon-blue-intense": "0 0 25px rgba(0, 240, 255, 0.6), inset 0 0 15px rgba(0, 240, 255, 0.2)",
        "neon-purple": "0 0 20px rgba(121, 40, 202, 0.5), inset 0 0 10px rgba(121, 40, 202, 0.2)",
        "neon-red": "0 0 20px rgba(255, 51, 102, 0.5), inset 0 0 10px rgba(255, 51, 102, 0.2)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "scanline": "scanline 8s linear infinite",
        "hologram-flicker": "hologram 0.15s ease infinite alternate",
        "border-glow": "borderGlow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(1000%)" },
        },
        borderGlow: {
          "0%": { borderColor: "rgba(0, 240, 255, 0.3)", boxShadow: "0 0 10px rgba(0, 240, 255, 0.2)" },
          "100%": { borderColor: "rgba(0, 240, 255, 0.8)", boxShadow: "0 0 25px rgba(0, 240, 255, 0.6), inset 0 0 10px rgba(0, 240, 255, 0.3)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
