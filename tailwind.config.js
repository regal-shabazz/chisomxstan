/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./*.js"],
  theme: {
    extend: {
      fontFamily: {
        josefin: ['Josefin Sans', 'sans-serif'],
        sacramento: ['Sacramento', 'cursive'],
      }
    },
    container: {
      center: true,
      padding: '0',
      screens: {
        sm: '600px',
        md: '800px',
        lg: '1000px',
        xl: '1200px',
      },
    },
    plugins: [],
  }
}
