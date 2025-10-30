/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './public/**/*.html',
        './public/**/*.js'
    ],
    theme: {
        extend: {
        fontFamily: {
            sans: ['Inter', 'system-ui', 'sans-serif'],
            display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        },
        colors: {
            primary: {
            50: '#fafafa',
            100: '#e5e5e5',
            200: '#d4d4d4',
            300: '#a3a3a3',
            400: '#737373',
            500: '#525252',
            600: '#404040',
            700: '#262626',
            800: '#171717',
            900: '#0a0a0a',
            },
        },
        animation: {
            'fade-in': 'fadeIn 0.4s ease-out'
        },
        keyframes: {
            fadeIn: {
            '0%': { opacity: '0', transform: 'translateY(10px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
            },
        },
        },
    },
    plugins: [],
}
