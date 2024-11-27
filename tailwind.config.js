/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#080708",
        secondary: "#3772ff",
        tertiary: "#df2935",
        quaternary: "#fdca40",
        quinary: "#e6e8e6",
        primaryMild: "#80a5ff",
      },
    },
  },
  plugins: [],
};
