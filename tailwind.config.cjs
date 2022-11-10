/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2196f2",
        secondary: "#ffc107",
        terciary: "#2860ff",
        accent: "#ff9100",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
