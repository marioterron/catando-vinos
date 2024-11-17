/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        wine: {
          50: '#FCE8EC',
          100: '#F9D1D9',
          200: '#F3A3B4',
          300: '#ED758F',
          400: '#E7476A',
          500: '#E11945',
          600: '#B41437',
          700: '#870F29',
          800: '#5A0A1B',
          900: '#2D050E',
        },
      },
      fontFamily: {
        serif: ['Crimson Pro', 'Georgia', 'serif'],
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      scale: {
        102: '1.02',
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};