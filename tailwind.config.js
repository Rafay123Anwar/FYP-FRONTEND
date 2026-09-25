/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#FF6B00",
          hover:   "#E55F00",
          dark:    "#CC5400",
          dim:     "rgba(255,107,0,0.12)",
          50: "#FFF7ED", 100: "#FFEDD5", 200: "#FED7AA",
          300: "#FDBA74", 400: "#FB923C", 500: "#FF6B00",
          600: "#EA580C", 700: "#C2410C", 800: "#9A3412", 900: "#7C2D12",
        },
        navy: {
          DEFAULT: "#0F172A",
          light:   "#1E293B",
          lighter: "#273549",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
      boxShadow: {
        card:      "0 1px 3px rgba(0,0,0,.06), 0 4px 12px rgba(0,0,0,.06)",
        elevated:  "0 4px 6px rgba(0,0,0,.05), 0 10px 30px rgba(0,0,0,.10)",
        glow:      "0 0 24px rgba(255,107,0,0.22)",
        "card-dark":"0 1px 3px rgba(0,0,0,.3), 0 4px 12px rgba(0,0,0,.3)",
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
      },
      transitionDuration: {
        "150": "150ms",
        "250": "250ms",
        "350": "350ms",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

