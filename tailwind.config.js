/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // Components at project root
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}", // For Next.js 13+ App Router, if used
  ],
  darkMode: 'class', 
  theme: {
    extend: {
      colors: {
        'dark-primary': '#1a1a1a',
        'dark-secondary': '#2a2a2a',
        'dark-accent': '#0070f3',
        'dark-text-primary': '#e0e0e0',
        'dark-text-secondary': '#a0a0a0',
        'brand-blue': '#0070f3',
        'brand-light-blue': '#3291ff',
        'gray-dark': '#1a202c',
        'gray-medium': '#2d3748',
        'gray-light': '#4a5568',
        'text-main': '#ffffff',
        'text-secondary': '#cbd5e0',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}; 