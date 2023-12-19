import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default defineConfig((configEnv) =>
  mergeConfig(
    // @ts-ignore
    viteConfig(configEnv),
    defineConfig({
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
        root: fileURLToPath(new URL('./', import.meta.url))
      }
    })
  )
)
