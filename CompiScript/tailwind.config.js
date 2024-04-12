/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    'node_modules/flowbite-react/lib/esm/**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        'bblue-50' : '#f2f7fb',
        'bblue-100' : '#e7f0f8',
        'bblue-200' : '#d3e2f2',
        'bblue-300' : '#b9cfe8',
        'bblue-400' : '#9cb6dd',
        'bblue-500' : '#839dd1',
        'bblue-600' : '#6a7fc1',
        'bblue-700' : '#6374ae',
        'bblue-800' : '#4a5989',
        'bblue-900' : '#414e6e',
        'bblue-950' : '#262c40',
        'gris':'#343a40',
        'gris-50':'#4C4F53',
      }
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

