import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#101010",
        surface: "#1A1A1A",
        "surface-2": "#222222",
        gold: "#C6A46A",
        "gold-soft": "#D8C094",
        bronze: "#8B7355",
        cream: "#F5F2EC",
        muted: "#A5A5A5",
        line: "rgba(255,255,255,0.08)",
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
