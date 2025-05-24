/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gray: {
          100: "#ffffff", //bg color for card component
          200: "#f9fbfc",
          600: "#7e878b",
        },
        purple: {
          200: "#e0e7ff", //bg for secondary button
          400: "#9e9ae8", // text color for primary button
          500: "#443ab9", //text color for secondary button
          600: "#5046e4", //bg color for primary button
        },
      },
    },
  },
  plugins: [],
};
