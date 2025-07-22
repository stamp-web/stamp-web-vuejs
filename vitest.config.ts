import { fileURLToPath } from 'node:url'
import path from 'path'
import { mergeConfig, defineConfig, configDefaults, type ViteUserConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default defineConfig(async ({ mode }: { mode: string }): Promise<ViteUserConfig> => {
  const viteConf = await viteConfig({ mode })
  return mergeConfig(
    viteConf,
    defineConfig({
      resolve: {
        alias: {
          '@': path.resolve(__dirname, 'src') // Adjust if your source folder is different
        }
      },
      test: {
        setupFiles: ['./src/vitest-setup.ts'],
        environment: 'jsdom',
        reporters: ['verbose', 'junit'],
        mockReset: true,
        coverage: {
          reporter: ['text', 'html']
        },
        outputFile: {
          junit: './test-results/test-output.xml',
          json: './test-results/json-report.json'
        },
        globals: true,
        exclude: [...configDefaults.exclude, 'e2e/**'],
        root: fileURLToPath(new URL('./', import.meta.url)),
        server: {
          deps: {
            inline: ['@vueform/vueform']
          }
        }
      }
    })
  )
})
