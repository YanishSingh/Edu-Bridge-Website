/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#D6212A', // Edu-Bridge Red
          light: '#E84A52',
          dark: '#B01A22',
        },
        secondary: {
          DEFAULT: '#0F4570', // Edu-Bridge Blue
          light: '#1A5A8F',
          dark: '#0A2F4A',
        },
        text: {
          DEFAULT: '#333333', // Body text color
          light: '#666666',
          dark: '#1A1A1A',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        marquee: "marquee 45s linear infinite",
        "marquee-reverse": "marquee-reverse 45s linear infinite",
      },
    },
  },
  plugins: [],
}

