/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')
const tsConfig = require('./tsconfig.eslint.json')

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting',
    'plugin:you-dont-need-lodash-underscore/compatible'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  ignorePatterns: tsConfig.exclude,
  rules: {

  }
}
