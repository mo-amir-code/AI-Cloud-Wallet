/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#0A0A0A",
        secondary: "#1F1F1F",
        accent: "#00C853",
        text: "#E0E0E0"
      }
    },
  },
  plugins: [],
}