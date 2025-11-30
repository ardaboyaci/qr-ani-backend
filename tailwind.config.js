/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                playfair: ['var(--font-playfair)'],
                inter: ['var(--font-inter)'],
            },
            colors: {
                gold: {
                    DEFAULT: '#D4AF37',
                    light: '#F4E5C2',
                    dark: '#B8941F'
                },
                bronze: '#8B7355',
                charcoal: '#1F2937',
                ivory: '#F5F5F0'
            },
        },
    },
    plugins: [],
};
