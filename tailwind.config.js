/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./node_modules/nativewind/**/*.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
