import './assets/main.css'

import Vueform from '@vueform/vueform'
import vueformConfig from '../vueform.config'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

createApp(App).use(createPinia()).use(router).use(Vueform, vueformConfig).mount('#app')
