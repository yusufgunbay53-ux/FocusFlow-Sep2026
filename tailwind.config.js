/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        night: "#0b111e",
        neon: "#00d2ff",
        panel: "rgba(16, 24, 40, 0.72)",
      },
      boxShadow: {
        neon: "0 0 24px rgba(0, 210, 255, 0.25)",
      },
      fontFamily: {
        sans: ["Sora", "Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
