/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sidebar: '#0d3a47',
        'sidebar-active': '#138a7e',
        primary: '#0d9488',
        'primary-dark': '#0a7569',
      },
    },
  },
  plugins: [],
}
