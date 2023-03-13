const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./src/**/*.{html,svelte}'],
  theme: {
    container: {
      center: true
    },
    extend: {
      colors: {
        bg: '#212121',
        fg: '#fafafa',
        active: '#cfd8dc',
        disabled: '#616161',
        hover: '#484848',
        invalid: '#dd2c00'
      },
      fontFamily: {
        sans: ['"Press Start 2P"', ...defaultTheme.fontFamily.sans]
      }
    }
  }
}
