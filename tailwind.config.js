/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6366f1", // Indigo
        secondary: "#f59e0b", // Amber
        dark: "#0f172a", // Slate 900
        premium: "#7c3aed", // Violet
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
