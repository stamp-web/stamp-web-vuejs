import 'floating-vue/dist/style.css'
import './assets/main.css'
import 'vue-toast-notification/dist/theme-default.css'

import App from './App.vue'
import router from './router'

import Vueform from '@vueform/vueform'
import VueLogger from 'vuejs3-logger'
import type { ILoggerOptions } from 'vuejs3-logger/dist/interfaces/logger-options'
import ToastPlugin from 'vue-toast-notification'
import vueformConfig from '../vueform.config'
import { Tooltip, vTooltip } from 'floating-vue'

// Needed for test resolution to avoid warnings
import { createApp } from 'vue'
import { createPinia } from 'pinia'

// @ts-ignore
import eventBus from 'vue3-eventbus'

import ProgressBar from '@/components/display/ProgressBar.vue'
import ClickableIconCellRenderer from '@/components/renderers/ClickableIconCellRenderer.vue'
import LocaleUtilities from '@/util/locale-utils'

const i18n = LocaleUtilities.getI18n()

const isDebug = location.href.includes('debug=true')

const logOptions = {
  isEnabled: true,
  logLevel: isDebug ? 'debug' : 'error',
  showConsoleColors: true
} as ILoggerOptions

// @ts-ignore
const app = createApp(App)
  .use(createPinia())
  .use(router)
  .use(Vueform, vueformConfig)
  .use(eventBus)
  .use(ToastPlugin)
  .use(VueLogger, logOptions)
  .use(i18n)
/**
 * Globally define cell renderers so they can be used by name without having to import them all in the Grid Component
 */
app.component('ClickableIconCellRenderer', ClickableIconCellRenderer)
app.component('ProgressBar', ProgressBar)
app.component('VTooltip', Tooltip)
app.directive('tooltip', vTooltip)
app.mount('#app')
