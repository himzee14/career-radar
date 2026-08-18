import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F6F5F2",
        surface: "#FFFFFF",
        ink: {
          900: "#1B1E22",
          700: "#33383E",
          500: "#6B7280",
          300: "#9AA0A6",
        },
        line: "#E7E5E0",
        accent: {
          DEFAULT: "#2C4A6E",
          dark: "#1F3550",
          tint: "#DCE6EE",
        },
        gold: {
          DEFAULT: "#B8863B",
          tint: "#F3E6D2",
        },
        moss: {
          DEFAULT: "#3F7A5A",
          tint: "#DEEBE3",
        },
        brick: {
          DEFAULT: "#B5453B",
          tint: "#F6E1DE",
        },
      },
      fontFamily: {
        sans: ["var(--font-plex-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(27, 30, 34, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
