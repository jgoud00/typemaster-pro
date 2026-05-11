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
        primary: "#06B6D4",
        "primary-hover": "#0891B2",
        success: "#22C55E",
        error: "#F87171",
        warning: "#EAB308",
        surface: "#0F172A",
        "surface-elevated": "#1E293B",
        "border-subtle": "#334155",
        "text-primary": "#F1F5F9",
        "text-secondary": "#94A3B8",
        "text-muted": "#64748B",
      },
    },
  },
  plugins: [],
};

export default config;
