// const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./src/**/*.{html,svelte}'],
  theme: {
    extend: {
      // fontFamily: {
      //   sans: ['"Inter"', ...defaultTheme.fontFamily.sans],
      //   serif: ['"Press Start 2P"', ...defaultTheme.fontFamily.serif]
      // }
    },
    container: {
      center: true
    }
  }
}
