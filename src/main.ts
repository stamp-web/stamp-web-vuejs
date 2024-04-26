import 'floating-vue/dist/style.css'
import './assets/main.css'
import 'vue-toast-notification/dist/theme-default.css'

import Vueform from '@vueform/vueform'
import ToastPlugin from 'vue-toast-notification'
import vueformConfig from '../vueform.config'
import { Tooltip, vTooltip } from 'floating-vue'

// Needed for test resolution to avoid warnings
import { createApp } from 'vue'
import { createPinia } from 'pinia'

// @ts-ignore
import eventBus from 'vue3-eventbus'

import App from './App.vue'
import router from './router'
import ClickableIconCellRenderer from '@/components/renderers/ClickableIconCellRenderer.vue'

import LocaleUtilities from '@/util/locale-utils'

const i18n = LocaleUtilities.getI18n()

// @ts-ignore
const app = createApp(App)
  .use(createPinia())
  .use(router)
  .use(Vueform, vueformConfig)
  .use(eventBus)
  .use(ToastPlugin)
  .use(i18n)
/**
 * Globally define cell renderers so they can be used by name without having to import them all in the Grid Component
 */
app.component('ClickableIconCellRenderer', ClickableIconCellRenderer)
app.component('VTooltip', Tooltip)
app.directive('tooltip', vTooltip)
app.mount('#app')
