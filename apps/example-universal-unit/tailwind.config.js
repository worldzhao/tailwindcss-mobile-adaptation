const { adapter } = require('./tailwind.adapter');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{jsx,js}'],
  theme: {
    ...adapter(),
    extend: {},
  },
  plugins: [],
};
