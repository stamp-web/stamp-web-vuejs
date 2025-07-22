import { config } from '@vue/test-utils'
import { vi } from 'vitest'
import Vueform from '@vueform/vueform'
import vueformConfig from '../vueform.config'
import FloatingVue from 'floating-vue'
import VueLogger from 'vuejs3-logger'
import { createI18n } from 'vue-i18n'

import enUS from './locales/en-US.json'
import { ModuleRegistry, ClientSideRowModelModule } from 'ag-grid-community'

const i18n = createI18n<false>({
  legacy: false,
  locale: 'en-US',
  fallbackLocale: 'en-US',
  globalInjection: true,
  messages: {
    'en-US': enUS
  }
})

// Bootstrap ag-grid
ModuleRegistry.registerModules([ClientSideRowModelModule])

config.global.plugins = config.global.plugins || []
config.global.plugins.push([Vueform, vueformConfig])
config.global.plugins.push([VueLogger])
config.global.plugins.push([FloatingVue])
config.global.plugins.push([i18n])

// Mock for IntersectionObserver
class IntersectionObserverMock {
  constructor(
    public callback: IntersectionObserverCallback,
    public options?: IntersectionObserverInit
  ) {}
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
  takeRecords = vi.fn().mockReturnValue([])
}

global.IntersectionObserver = IntersectionObserverMock as unknown as typeof IntersectionObserver
