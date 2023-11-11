import './assets/main.css'

import Vueform from '@vueform/vueform'
import vueformConfig from '../vueform.config'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App).use(createPinia()).use(router).use(Vueform, vueformConfig)
// if we need it
app.config.globalProperties.window = window
app.mount('#app')
