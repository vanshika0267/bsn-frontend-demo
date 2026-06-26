/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          blue: '#2563EB',
          navy: '#0F172A',
        },
        secondary: {
          DEFAULT: '#0F172A',
          navy: '#0F172A',
        },
        success: {
          DEFAULT: '#22C55E',
          green: '#22C55E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
