import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#FFF8ED",
          100: "#FFF1DC",
          200: "#FFEBD2",
          300: "#FFD9A8",
          400: "#FFC94A",
          500: "#F2994A",
          600: "#E07F2A",
          700: "#C4671A",
          800: "#8A6A05",
          900: "#2B1D0E",
        },
        surface: {
          light: "#FFFFFF",
          alt: "#FFF1DC",
          dark: "#26190D",
          darkAlt: "#301F0F",
        },
      },
      fontFamily: {
        sora: ["Sora", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(60,35,5,0.04), 0 10px 28px rgba(60,35,5,0.08)",
        "soft-dark": "0 1px 2px rgba(0,0,0,0.3), 0 10px 30px rgba(0,0,0,0.45)",
      },
    },
  },
  plugins: [],
};

export default config;
