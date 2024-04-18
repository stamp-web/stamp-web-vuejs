/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,vue,tsx}',
    './vueform.config.js',
    './node_modules/@vueform/vueform/themes/tailwind/**/*.vue',
    './node_modules/@vueform/vueform/themes/tailwind/**/*.js'
  ],
  theme: {
    extend: {
      minWidth: {
        160: '40rem',
        192: '48rem'
      },
      maxWidth: {
        160: '40rem'
      }
    }
  },
  plugins: [require('@vueform/vueform/tailwind')]
}
