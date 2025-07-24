import { createI18n } from 'vue-i18n'

import de from '../locales/de.json'
import enUS from '@/locales/en-US.json'

class LocaleUtilities {
  private readonly i18n
  constructor() {
    this.i18n = createI18n({
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

  /**
   * Sets the application's locale if the provided locale is available
   * @param locale - The locale to set (e.g., 'en-US', 'de')
   * @returns boolean indicating whether the locale was successfully set
   * @throws Error if the locale is not a string
   */
  setLocale(locale: 'en-US' | 'de'): boolean {
    const i18n = this.getI18n()

    if (i18n.global.availableLocales.includes(locale)) {
      i18n.global.locale = locale
      return true
    }

    console.warn(`Locale '${locale}' is not available. Using fallback locale.`)
    return false
  }

  t(key: string, options?: Record<string, unknown>) {
    if (!options) {
      return this.getI18n().global.t(key)
    }
    return this.getI18n().global.t(key, options)
  }
}

export default new LocaleUtilities()
