import { describe, expect, it } from 'vitest'
import { CurrencyCode, CurrencyTools } from '../CurrencyCode'

describe('CurrencyTools', () => {
  describe('asCurrencyString', () => {
    it('USD simple value', () => {
      const v = CurrencyTools.asCurrencyString(43.52, CurrencyCode.USD)
      expect(v).toBe('$43.52')
    })

    it('USD larger value', () => {
      const v = CurrencyTools.asCurrencyString(25043.52, CurrencyCode.USD)
      expect(v).toBe('$25,043.52')
    })

    it('EUR simple value', () => {
      const v = CurrencyTools.asCurrencyString(53.0, CurrencyCode.EUR)
      expect(v).toBe('€53.00')
    })

    it('JPY simple value', () => {
      const v = CurrencyTools.asCurrencyString(100542, CurrencyCode.JPY)
      expect(v).toBe('¥100,542')
    })
  })
})
