import './assets/main.css'

import Vueform from '@vueform/vueform'
import vueformConfig from '../vueform.config'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import ClickableIconCellRenderer from '@/components/renderers/ClickableIconCellRenderer.vue'
import StampCollectionCellRenderer from '@/components/renderers/StampCollectionCellRenderer.vue'

const app = createApp(App).use(createPinia()).use(router).use(Vueform, vueformConfig)
/**
 * Globally define cell renderers so they can be used by name without having to import them all in the Grid Component
 */
app.component('ClickableIconCellRenderer', ClickableIconCellRenderer)
app.component('StampCollectionCellRenderer', StampCollectionCellRenderer)

app.mount('#app')
