import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // theme-aware tokens (values live in globals.css; .dark-zone flips them)
        ink: "rgb(var(--c-bg) / <alpha-value>)",
        surface: "rgb(var(--c-surface) / <alpha-value>)",
        "surface-2": "rgb(var(--c-surface-2) / <alpha-value>)",
        white: "rgb(var(--c-fg) / <alpha-value>)",
        gold: "rgb(var(--c-gold) / <alpha-value>)",
        "gold-soft": "rgb(var(--c-gold-soft) / <alpha-value>)",
        muted: "rgb(var(--c-muted) / <alpha-value>)",
        line: "rgb(var(--c-fg) / 0.1)",
        "on-gold": "rgb(var(--c-on-gold) / <alpha-value>)",
        hv: "rgb(var(--c-hv) / <alpha-value>)",
        "hv-fg": "rgb(var(--c-hv-fg) / <alpha-value>)",
        // fixed tokens
        deep: "#101010",
        bronze: "#8B7355",
        cream: "#F5F2EC",
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', "Georgia", "serif"],
        sans: ['"Manrope Variable"', "system-ui", "sans-serif"],
      },
      letterSpacing: { luxe: "0.32em", wide2: "0.18em" },
      maxWidth: { site: "1440px" },
      transitionTimingFunction: { luxe: "cubic-bezier(0.22, 1, 0.36, 1)" },
      keyframes: {
        scrollDot: { "0%": { transform: "translateY(0)", opacity: "0" }, "30%": { opacity: "1" }, "100%": { transform: "translateY(18px)", opacity: "0" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
      },
      animation: {
        scrollDot: "scrollDot 1.8s cubic-bezier(0.22,1,0.36,1) infinite",
        shimmer: "shimmer 2.2s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
