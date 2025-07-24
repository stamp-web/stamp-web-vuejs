import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import pluginVitest from '@vitest/eslint-plugin'
import pluginPlaywright from 'eslint-plugin-playwright'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import tseslint from '@typescript-eslint/eslint-plugin'
// @ts-expect-error: not worth defining types of this
import noNeedForLodash from 'eslint-plugin-you-dont-need-lodash-underscore'

export default [
  {
    ignores: [
      'dist/**',
      'coverage/**',
      'test-results/**',
      'node_modules/**',
      'playwright-report/**'
    ]
  },

  ...defineConfigWithVueTs(
    {
      name: 'app/files-to-lint',
      files: ['**/*.{ts,mts,tsx,vue}']
    },
    pluginVue.configs['flat/essential'],
    vueTsConfigs.recommended,
    {
      ...pluginVitest.configs.recommended,
      files: ['src/**/__tests__/*']
    },
    {
      ...pluginPlaywright.configs['flat/recommended'],
      files: ['e2e/**/*.{test,spec}.{js,ts,jsx,tsx}']
    },

    skipFormatting
  ),
  {
    name: 'validate the lodash and underscore usages',
    //files: ['**/*.{ts,js,vue}'],
    plugins: {
      noNeedForLodash
    }
  },
  {
    name: 'TypeScript specific overrides',
    files: ['**/*.{ts,tsx,mts,vue}'],
    plugins: {
      tseslint
    },
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off'
    }
  }
]
