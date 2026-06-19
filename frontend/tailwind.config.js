/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        midnight: "#0f172a",
        panel: "#1e293b",
        accent: "#ef4444",
        gold: "#f59e0b",
        ice: "#38bdf8",
      },
      boxShadow: {
        glow: "0 0 28px rgba(239, 68, 68, 0.35)",
        card: "0 18px 50px rgba(2, 6, 23, 0.35)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
