import { config } from '@vue/test-utils'
import Vueform from '@vueform/vueform'
import vueformConfig from '../vueform.config'

config.global.plugins = config.global.plugins || []
config.global.plugins.push([Vueform, vueformConfig])
