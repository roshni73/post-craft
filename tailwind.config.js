// tailwind.config.cjs
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}", // ← This must include your React files
  ],
  darkMode: "class", // Optional for dark mode
  theme: {
    extend: {},
  },
  plugins: [],
};
