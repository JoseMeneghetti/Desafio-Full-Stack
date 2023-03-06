/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        theme: "0px 3px 20px #000;",
      },
      backgroundColor: {
        "dark-theme": "#1e1e1e",
        "input-theme": "#353535",
        "green-theme": "#118553"
      },
    },
  },
  plugins: [],
};
