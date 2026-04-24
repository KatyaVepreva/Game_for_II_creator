/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#140F22",
        bgSoft: "#201533",
        bgSoft2: "#1A1230",
        bgDeep: "#0E0A18",
        accent: "#5A5DFF",
        accentAlt: "#8A4DFF",
        textMain: "#F5F4FF",
        textSoft: "#D8D2F0",
        success: "#56D8A4",
        danger: "#FF6DAF"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(138, 77, 255, 0.25), 0 0 28px rgba(90, 93, 255, 0.25)"
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.75" },
          "50%": { opacity: "1" }
        }
      },
      animation: {
        fadeUp: "fadeUp 0.35s ease-out",
        pulseSoft: "pulseSoft 2.2s ease-in-out infinite"
      }
    }
  },
  plugins: []
};
