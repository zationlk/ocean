import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          deep: "#006060",
          dark: "#004C4C",
          light: "#00A0A0",
          50: "#F0FAFA",
          100: "#CCEFEF",
          200: "#99DFDF",
          300: "#66CFCF",
          400: "#33BFBF",
          500: "#00A0A0",
          600: "#006060",
          700: "#004C4C",
          800: "#003838",
          900: "#002424",
        },
        brand: {
          primary: "#006060",
          dark: "#004C4C",
          light: "#00A0A0",
          bg: "#F5F7F7",
          border: "#E0E0E0",
          text: "#555555",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Playfair Display", "Georgia", "serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "teal-gradient": "linear-gradient(135deg, #004C4C 0%, #006060 50%, #00A0A0 100%)",
        "hero-gradient": "linear-gradient(135deg, #002424 0%, #004C4C 40%, #006060 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.6s ease-out",
        "slide-in-left": "slideInLeft 0.6s ease-out",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0, 160, 160, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(0, 160, 160, 0.6)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      boxShadow: {
        "teal-glow": "0 0 30px rgba(0, 96, 96, 0.3)",
        "teal-glow-lg": "0 0 60px rgba(0, 96, 96, 0.4)",
        "card": "0 4px 24px rgba(0, 0, 0, 0.08)",
        "card-hover": "0 12px 48px rgba(0, 96, 96, 0.2)",
      },
    },
  },
  plugins: [],
};
export default config;
