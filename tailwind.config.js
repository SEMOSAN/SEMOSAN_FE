const tokens = require("./tokens.cjs");
const typographyPlugin = require("./typography-plugin.cjs");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./features/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: tokens.colors,
      spacing: tokens.spacing,
      borderRadius: tokens.borderRadius,
    },
  },
  safelist: [
    {
      pattern: /^typo-/,
    },
  ],
  plugins: [typographyPlugin],
};
