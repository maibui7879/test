/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    content: ['./src/**/*.{html,js,ts,tsx}', './public/index.html'],
    theme: {
        extend: {},
    },
    plugins: [require('tailwind-scrollbar')({ nocompatible: true })],
};
