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
        gold: {
          DEFAULT: "#D4AF37",
          light: "#EADDC9",
          dark: "#A3802B",
          50: "#FAF8F5",
          100: "#F5EFE6",
          200: "#EADDC9",
          300: "#DCBA89",
          400: "#CE974A",
          500: "#D4AF37",
          600: "#B08D27",
          700: "#8C6E1C",
          800: "#684F12",
          900: "#443209",
        },
        brand: {
          primary: "#D4AF37",
          dark: "#0F0F11",
          light: "#EADDC9",
          bg: "#070708",
          border: "#1D1D22",
          text: "#D1D1D6",
          obsidian: "#070708",
          charcoal: "#1A1A1E",
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
        "gold-gradient": "linear-gradient(135deg, #8C6E1C 0%, #D4AF37 50%, #151518 100%)",
        "hero-gradient": "linear-gradient(135deg, #070708 0%, #111114 60%, #1A1A1E 100%)",
      },
      animation: {
        "fade-in":      "fadeIn 0.6s ease-out",
        "slide-up":     "slideUp 0.6s ease-out",
        "slide-in-left":"slideInLeft 0.6s ease-out",
        "glow-pulse":   "glowPulse 2s ease-in-out infinite",
        "float":        "float 3s ease-in-out infinite",
        "spin-slow":    "spinSlow 8s linear infinite",
        "orb-float":    "orbFloat 12s ease-in-out infinite",
        "shimmer-text": "goldShimmer 4s linear infinite",
        "border-pulse": "borderPulse 3s ease-in-out infinite",
        "marquee":      "marquee 30s linear infinite",
      },
      keyframes: {
        fadeIn:      { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp:     { "0%": { opacity: "0", transform: "translateY(30px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        slideInLeft: { "0%": { opacity: "0", transform: "translateX(-30px)" }, "100%": { opacity: "1", transform: "translateX(0)" } },
        glowPulse:   { "0%, 100%": { boxShadow: "0 0 20px rgba(212,175,55,0.3)" }, "50%": { boxShadow: "0 0 40px rgba(212,175,55,0.6)" } },
        float:       { "0%, 100%": { transform: "translateY(0px)" }, "50%": { transform: "translateY(-10px)" } },
        spinSlow:    { "from": { transform: "rotate(0deg)" }, "to": { transform: "rotate(360deg)" } },
        orbFloat:    { "0%, 100%": { transform: "translate(0,0) scale(1)" }, "33%": { transform: "translate(30px,-20px) scale(1.05)" }, "66%": { transform: "translate(-20px,15px) scale(0.95)" } },
        goldShimmer: { "0%": { backgroundPosition: "-200% center" }, "100%": { backgroundPosition: "200% center" } },
        borderPulse: { "0%, 100%": { borderColor: "rgba(212,175,55,0.2)" }, "50%": { borderColor: "rgba(212,175,55,0.6)" } },
        marquee:     { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
      },
      boxShadow: {
        "gold-glow": "0 0 30px rgba(212, 175, 55, 0.25)",
        "gold-glow-lg": "0 0 60px rgba(212, 175, 55, 0.4)",
        "card": "0 4px 24px rgba(0, 0, 0, 0.04)",
        "card-hover": "0 12px 48px rgba(212, 175, 55, 0.15)",
      },
    },
  },
  plugins: [],
};
export default config;
