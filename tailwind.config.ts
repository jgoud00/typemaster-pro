import type { Config } from "tailwindcss";

const config: Config & { safelist?: string[] } = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    "fill-emerald-500/20",
    "stroke-emerald-500/50",
    "fill-green-500/20",
    "stroke-green-500/50",
    "fill-yellow-500/20",
    "stroke-yellow-500/50",
    "fill-orange-500/20",
    "stroke-orange-500/50",
    "fill-red-500/20",
    "stroke-red-500/50",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#f59e0b",
        "primary-hover": "#d97706",
        brand: "#f59e0b",
        "brand-hover": "#d97706",
        "brand-muted": "rgba(245, 158, 11, 0.12)",
        success: "#10b981",
        error: "#ef4444",
        warning: "#f59e0b",
        danger: "#ef4444",
        surface: "#09090d",
        "surface-primary": "#09090d",
        "surface-secondary": "#121217",
        "surface-elevated": "#181820",
        "border-subtle": "rgba(255, 255, 255, 0.08)",
        "border-strong": "rgba(255, 255, 255, 0.16)",
        "text-primary": "#fafafa",
        "text-secondary": "#a1a1aa",
        "text-muted": "#71717a",
        streak: "#f97316",
        achievement: "#eab308",
      },
    },
  },
  plugins: [],
};

export default config;
