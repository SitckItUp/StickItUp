/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        "slate-950": "rgb(2 6 23)",
        "slate-800": "rgb(30 41 59)",
        "slate-700": "rgb(51 65 85)",
        "slate-600": "rgb(71 85 105)",
        "slate-200": "rgb(226 232 240)",
        "slate-100": "rgb(241 245 249)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        black: "#000",
        white: "#fff",
        gray: {
          100: "#f7fafc",
          500: "#989684",
          900: "#1a202c",
        },
        gold: "#ffc51a",
      },
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },

  },
  plugins: [],
};
