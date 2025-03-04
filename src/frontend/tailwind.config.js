/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3b82f6",
        },
        secondary: {
          DEFAULT: "#f43f5e",
        },
        accent: {
          DEFAULT: "#10b981",
        },
        background: {
          DEFAULT: "#ffffff",
        },
        foreground: {
          DEFAULT: "#000000",
        },
      },
    },
  },
  plugins: [],
}