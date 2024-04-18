// vueform.config.js

import en from '@vueform/vueform/locales/en'
import '@vueform/vueform/types/index.d.ts'
import '@vueform/vueform/themes/vueform/css/index.min.css'
import tailwind from '@vueform/vueform/themes/tailwind'
export default {
  //classHelpers: true,
  theme: tailwind,
  locales: { en },
  locale: 'en'
}
