import tailwind from '@vueform/vueform/tailwind'

/** @type {import('tailwindcss').Config} */
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
  plugins: [tailwind]
}
