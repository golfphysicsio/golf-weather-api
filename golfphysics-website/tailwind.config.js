/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'golf-green': '#2E7D32',
        'golf-green-dark': '#1B5E20',
        'golf-green-light': '#81C784',
        'sky-blue': '#1976D2',
        'warm-orange': '#F57C00',
        'success-green': '#43A047',
        'error-red': '#E53935',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['Fira Code', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}
