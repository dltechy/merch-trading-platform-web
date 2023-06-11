/** @type {import('tailwindcss').Config} */
const tailwindCssForms = require('@tailwindcss/forms');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [tailwindCssForms],
};
