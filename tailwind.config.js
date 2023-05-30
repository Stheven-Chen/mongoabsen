/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': "#AEC6CF"
      },
      fontFamily: {
        'Poppins': 'Poppins, sans-serif'
      },
      width: {
        '200': '200px'
      }
    },
  },
  plugins: [],
};
