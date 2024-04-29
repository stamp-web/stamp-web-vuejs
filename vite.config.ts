import { fileURLToPath, URL } from 'node:url'
import fs from 'fs'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import basicSsl from '@vitejs/plugin-basic-ssl'
import process from 'node:process'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import replace from '@rollup/plugin-replace'

// https://vitejs.dev/config/
// @ts-ignore
export default ({ mode }) => {
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

  const config = {
    plugins: [vue(), basicSsl(), tailwindcss, autoprefixer],
    https: true
  }

  if (process.argv.includes('preview')) {
    config.plugins.pop()
    config.https = false
  }

  if (mode !== 'production' && !CI) {
    // @ts-ignore
    config.proxy = {
      '^/stamp-webservices': {
        target: process.env.VITE_PROXY_URL,
        secure: false,
        ssl: {
          key: fs.readFileSync(process.env.VITE_SSL_KEY as string, 'utf8'),
          cert: fs.readFileSync(process.env.VITE_SSL_CERT as string, 'utf8')
        },
        changeOrigin: true,
        configure: (proxy: object, options: object) => {
          // @ts-ignore
          options.auth = `${process.env.VITE_PROXY_USER}:${process.env.VITE_PROXY_PASSWORD}`
        }
      }
    }
  }

  return defineConfig({
    // @ts-ignore
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
            pinia: ['pinia', 'pinia-generic'],
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
      // @ts-ignore
      https: config.https,
      // @ts-ignore
      proxy: config.proxy
    },
    resolve: {
      alias: {
        vue: 'vue/dist/vue.esm-bundler',
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  })
}
