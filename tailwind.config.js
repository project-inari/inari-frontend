/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './components/**/*.{vue,js,ts,jsx,tsx}',
        './pages/**/*.{vue,js,ts,jsx,tsx}',
        './layouts/**/*.{vue,js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                dmsans: ['DM Sans', 'sans-serif'],
                prompt: ['Prompt', 'sans-serif'],
                sarabun: ['Sarabun', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
