/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#171717',
        sand: '#f7f1e8',
        ember: '#d97706',
        pine: '#14532d',
      },
    },
  },
  presets: [require('nativewind/preset')],
};
