/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        papaya: {
          50: '#FFF4EE',
          100: '#FFE4D3',
          200: '#FFC9A8',
          300: '#FFAD7D',
          400: '#FF9770',
          500: '#F47C52',
          600: '#D9623B',
        },
        ink: {
          900: '#0A0A0A',
          700: '#2C2C2E',
          500: '#6E6E73',
          300: '#D2D2D7',
          100: '#F5F5F7',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Inter"',
          '"Segoe UI"',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
