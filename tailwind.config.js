/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af', // Accessible deeper blue
          900: '#1e3a8a', // Core Primary (SathiAI Trust Blue)
          950: '#172554',
        },
        accent: { // Orange/Saffron for warmth and call to action
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        guidance: { // Softer amber/orange for "Ineligible" / Guidance instead of red
          light: '#fef3c7',
          DEFAULT: '#d97706',
          dark: '#92400e'
        }
      }
    },
  },
  plugins: [],
}
