import { createI18n } from 'vue-i18n'

import de from '../locales/de.json'
import enUS from '@/locales/en-US.json'

class LocaleUtilities {
  private i18n
  constructor() {
    this.i18n = createI18n({
      legacy: false,
      locale: 'en-US',
      fallbackLocale: 'en-US',
      globalInjection: true,
      messages: {
        de: de,
        'en-US': enUS
      }
    })
  }

  /**
   * Returns the i18n instance as configured.  Ideally this should only be called from the main.js
   * of the application
   */
  getI18n() {
    return this.i18n
  }

  setLocale(locale: string): void {
    // @ts-ignore
    if (this.getI18n().global.availableLocales.includes(locale)) {
      // @ts-ignore
      this.getI18n().global.locale.value = locale
    }
  }

  t(key: string, options?: {}) {
    // @ts-ignore
    return this.getI18n().global.t(key, options)
  }
}

export default new LocaleUtilities()
