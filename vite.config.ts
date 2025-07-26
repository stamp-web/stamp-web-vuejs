import { fileURLToPath, URL } from 'node:url'
import fs from 'fs'
import {
  defineConfig,
  loadEnv,
  type ConfigEnv,
  type ProxyOptions,
  type ServerOptions,
  HttpProxy,
  PluginOption
} from 'vite'
import vue from '@vitejs/plugin-vue'
import basicSsl from '@vitejs/plugin-basic-ssl'
import process from 'node:process'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import replace from '@rollup/plugin-replace'

type CustomConfig = {
  https?: boolean
  proxy?: Record<string, ProxyOptions>
  plugins: PluginOption[]
}

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv) => {
  const CI = !!process.env.CI
  /**
   * When called from vitest the mode will be 'test'. Any variables defined in .env.test will
   * supercede properties, but load the development environment variables to ensure a proper configuraton.
   */
  const processEnvironment = () => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

    if (mode === 'test' && !CI) {
      process.env = { ...process.env, ...loadEnv('development', process.cwd()) }
    }
  }
  processEnvironment()

  const config: CustomConfig = {
    plugins: [vue(), basicSsl(), tailwindcss, autoprefixer] as PluginOption[],
    https: true
  }

  if (process.argv.includes('preview')) {
    config.plugins.pop()
    config.https = false
  }

  if (mode !== 'production' && !CI) {
    config.proxy = {
      '^/stamp-webservices': {
        target: process.env.VITE_PROXY_URL,
        secure: false,
        ssl: {
          key: fs.readFileSync(process.env.VITE_SSL_KEY as string, 'utf8'),
          cert: fs.readFileSync(process.env.VITE_SSL_CERT as string, 'utf8')
        },
        changeOrigin: true,
        configure: (proxy: HttpProxy.Server, options: ProxyOptions) => {
          options.auth = `${process.env.VITE_PROXY_USER}:${process.env.VITE_PROXY_PASSWORD}`
        }
      }
    }
  }

  return defineConfig({
    plugins: config.plugins,
    base: '',
    build: {
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            grid: ['ag-grid-vue3'],
            gridcm: ['ag-grid-community'],
            vueform: ['@vueform/vueform'],
            prompts: ['sweetalert2'],
            pdfMake: ['pdfmake/build/pdfmake', 'pdfmake/build/vfs_fonts'],
            util: [
              'lodash-es/isNumber',
              'lodash-es/isEqual',
              'lodash-es/isObject',
              'lodash-es/isArrayLikeObject',
              'lodash-es/merge',
              'lodash-es/isEmpty',
              'lodash-es/cloneDeep',
              'odata-filter-parser'
            ],
            fetch: ['axios', 'blueimp-load-image'],
            vueCore: ['vue', 'vue-router', 'vue3-eventbus'],
            pinia: ['pinia'],
            i18n: ['vue-i18n'],
            tooltip: ['floating-vue', 'vue-toast-notification'],
            headlessui: ['@headlessui/vue']
          }
        },
        plugins: [
          replace({
            preventAssignment: true,
            __INTLIFY_JIT_COMPILATION__: true,
            __INTLIFY_DROP_MESSAGE_COMPILER__: false
          })
        ]
      }
    },
    optimizeDeps: {
      include: ['nouislider', 'wnumb', 'trix', 'axios', 'lodash']
    },
    server: {
      https: config.https,
      proxy: config.proxy as Record<string, ProxyOptions>
    } as ServerOptions,
    resolve: {
      alias: {
        vue: 'vue/dist/vue.esm-bundler',
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  })
}
