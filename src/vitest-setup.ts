import { config } from '@vue/test-utils'
import Vueform from '@vueform/vueform'
import vueformConfig from '../vueform.config'
import FloatingVue from 'floating-vue'

require('intersection-observer')

config.global.plugins = config.global.plugins || []
config.global.plugins.push([Vueform, vueformConfig])
config.global.plugins.push([FloatingVue])
