/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1f3a8a",
        secondary: "#22d3ee",
        success: "#22c55e",
        warning: "#f97316",
        error: "#ef4444",
        background: "#f8fafc",
      },
    },
  },
  plugins: [],
}