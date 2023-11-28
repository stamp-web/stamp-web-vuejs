import 'floating-vue/dist/style.css'
import './assets/main.css'

import Vueform from '@vueform/vueform'
import vueformConfig from '../vueform.config'
import FloatingVue from 'floating-vue'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import ClickableIconCellRenderer from '@/components/renderers/ClickableIconCellRenderer.vue'

const app = createApp(App)
  .use(createPinia())
  .use(router)
  .use(Vueform, vueformConfig)
  .use(FloatingVue)
/**
 * Globally define cell renderers so they can be used by name without having to import them all in the Grid Component
 */
app.component('ClickableIconCellRenderer', ClickableIconCellRenderer)

app.mount('#app')
