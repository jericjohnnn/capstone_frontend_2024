import forms from '@tailwindcss/forms'
import preline from 'preline/plugin'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    './node_modules/preline/preline.js',
  ],
  theme: {
    extend: {
      screens: {
        'tablet': '900px',
      },
    },
  },
  plugins: [
    forms,
    preline,
  ],
}

