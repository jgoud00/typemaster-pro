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
    extend: {},
  },
  plugins: [],
};

export default config;
