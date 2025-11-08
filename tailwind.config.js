/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        zinc: colors.zinc,
        sky: colors.sky,
      },
      fontFamily: {
        'sans': ['Lora', 'sans-serif'],
        'serif': ['"Noto Nastaliq Urdu"', 'Lora', 'serif'],
      },
      keyframes: {
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'glow': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        }
      },
      animation: {
        'scale-in': 'scale-in 0.2s ease-out',
        'glow': 'glow 3s ease-in-out infinite',
      },
      // A4 aspect ratio for preview
      aspectRatio: {
        'a4': '1 / 1.414',
      },
    },
  },
  plugins: [],
}