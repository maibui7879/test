/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  content: ['./src/**/*.{html,js,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      spacing: {
        sidebar: '256px', // Dùng class: w-sidebar
      },
      colors: {
        primary: {
          DEFAULT: '#3b82f6',
          dark: '#1e40af',
        },
        secondary: {
          DEFAULT: '#9333ea',
        },
      },
      fontSize: {
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
      },
    },
  },
  plugins: [require('tailwind-scrollbar')({ nocompatible: true })],
};
