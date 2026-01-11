import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // class-based dark mode
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        backgroundLight: "#f0f4f8",
        backgroundDark: "#0f172a",
        textLight: "#111827",
        textDark: "#e5e7eb",
        primaryLight: "#3b82f6",
        primaryDark: "#60a5fa",
      },
    },
  },
  plugins: [],
};

export default config;
