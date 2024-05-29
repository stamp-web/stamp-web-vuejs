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

    it('USD invalid value', () => {
      const v = CurrencyTools.asCurrencyString(NaN, CurrencyCode.USD)
      expect(v).toBe('')
    })

    it('USD null value', () => {
      // @ts-ignore
      const v = CurrencyTools.asCurrencyString(null, CurrencyCode.USD)
      expect(v).toBe('')
    })
  })

  describe('formatRegex', () => {
    it('verify input formats for USD', () => {
      const reg = CurrencyTools.formatRegex(CurrencyCode.USD, false)
      expect(reg.test('4234')).toBe(true)
      expect(reg.test('4500.23')).toBe(true)
      expect(reg.test('4500.2')).toBe(true)
      expect(reg.test('4,500.23')).toBe(false)
      expect(reg.test('4500.2322')).toBe(false)
      expect(reg.test('4500.'), '4500. not tested as false').toBe(false)
    })

    it('verify input formats for AUD', () => {
      const reg = CurrencyTools.formatRegex(CurrencyCode.AUD, false)
      expect(reg.test('4234')).toBe(true)
      expect(reg.test('4500.23')).toBe(true)
      expect(reg.test('4500.2')).toBe(true)
      expect(reg.test('4,500.23')).toBe(false)
      expect(reg.test('4500.2322')).toBe(false)
      expect(reg.test('4500.'), '4500. not tested as false').toBe(false)
    })

    it('verify input formats for CAD', () => {
      const reg = CurrencyTools.formatRegex(CurrencyCode.CAD, false)
      expect(reg.test('4234')).toBe(true)
      expect(reg.test('4500.23')).toBe(true)
      expect(reg.test('4500.2')).toBe(true)
      expect(reg.test('4,500.23')).toBe(false)
      expect(reg.test('4500.2322')).toBe(false)
      expect(reg.test('4500.'), '4500. not tested as false').toBe(false)
    })

    it('verify input formats for GBP', () => {
      const reg = CurrencyTools.formatRegex(CurrencyCode.GBP, false)
      expect(reg.test('4234')).toBe(true)
      expect(reg.test('4500.23')).toBe(true)
      expect(reg.test('4500.2')).toBe(true)
      expect(reg.test('4,500.23')).toBe(false)
      expect(reg.test('4500.2322')).toBe(false)
      expect(reg.test('4500.'), '4500. not tested as false').toBe(false)
    })

    it('verify input formats for EUR', () => {
      const reg = CurrencyTools.formatRegex(CurrencyCode.EUR, false)
      expect(reg.test('4234')).toBe(true)
      expect(reg.test('4500.23')).toBe(true)
      expect(reg.test('4500.2')).toBe(true)
      expect(reg.test('4,500.23')).toBe(false)
      expect(reg.test('4500.2322')).toBe(false)
      expect(reg.test('4500.'), '4500. not tested as false').toBe(false)
    })

    it('verify input formats for DEM', () => {
      const reg = CurrencyTools.formatRegex(CurrencyCode.DEM, false)
      expect(reg.test('4500.23')).toBe(false)
      expect(reg.test('4500.2')).toBe(false)
      expect(reg.test('4,500.23')).toBe(false)
      expect(reg.test('4500.2322')).toBe(false)
      expect(reg.test('4500.'), '4500. not tested as false').toBe(false)
      expect(reg.test('4234')).toBe(true)
    })

    it('verify input formats for JPY', () => {
      const reg = CurrencyTools.formatRegex(CurrencyCode.JPY, false)
      expect(reg.test('4234')).toBe(true)
      expect(reg.test('4500.23')).toBe(true)
      expect(reg.test('4500.2')).toBe(true)
      expect(reg.test('4,500.23')).toBe(false)
      expect(reg.test('4500.2322')).toBe(false)
      expect(reg.test('4500.'), '4500. not tested as false').toBe(false)
    })

    it('verify input formats for ITL', () => {
      const reg = CurrencyTools.formatRegex(CurrencyCode.ITL, false)
      expect(reg.test('4234')).toBe(true)
      expect(reg.test('4500.23')).toBe(true)
      expect(reg.test('4500.2')).toBe(true)
      expect(reg.test('4,500.23')).toBe(false)
      expect(reg.test('4500.2322')).toBe(false)
      expect(reg.test('4500.'), '4500. not tested as false').toBe(false)
    })

    it('verify input formats for SEK', () => {
      const reg = CurrencyTools.formatRegex(CurrencyCode.SEK, false)
      expect(reg.test('4234')).toBe(true)
      expect(reg.test('4500.23')).toBe(true)
      expect(reg.test('4500.2')).toBe(true)
      expect(reg.test('4,500.23')).toBe(false)
      expect(reg.test('4500.2322')).toBe(false)
      expect(reg.test('4500.'), '4500. not tested as false').toBe(false)
    })

    it('verify display formats for USD', () => {
      const reg = CurrencyTools.formatRegex(CurrencyCode.USD, true)
      expect(reg.test('4234')).toBe(true)
      expect(reg.test('4500.23')).toBe(true)
      expect(reg.test('4500.2')).toBe(true)
      expect(reg.test('4,500.23')).toBe(false)
      expect(reg.test('4500.2322')).toBe(false)
      expect(reg.test('4500.'), '4500. not tested as false').toBe(false)
    })

    it('verify display formats for EUR', () => {
      const reg = CurrencyTools.formatRegex(CurrencyCode.EUR, true)
      expect(reg.test('4234')).toBe(true)
      expect(reg.test('4500,23')).toBe(true)
      expect(reg.test('4500,2')).toBe(true)
      expect(reg.test('4,500,23')).toBe(false)
      expect(reg.test('4500,2322')).toBe(false)
      expect(reg.test('4500,'), '4500, not tested as false').toBe(false)
    })

    it('verify display formats for ITL', () => {
      const reg = CurrencyTools.formatRegex(CurrencyCode.ITL, true)
      expect(reg.test('4,234')).toBe(true)
      expect(reg.test('4,500.23')).toBe(true)
      expect(reg.test('23,567,500.23')).toBe(true)
      expect(reg.test('4,500.2')).toBe(false)
      expect(reg.test('4500.23')).toBe(false)
      expect(reg.test('4500.2322')).toBe(false)
      expect(reg.test('4500.'), '4500. not tested as false').toBe(false)
    })

    it('verify display formats for SEK', () => {
      const reg = CurrencyTools.formatRegex(CurrencyCode.SEK, true)
      expect(reg.test('4.234')).toBe(true)
      expect(reg.test('4.500,23')).toBe(true)
      expect(reg.test('23.567.500,23')).toBe(true)
      expect(reg.test('4.500,2')).toBe(false)
      expect(reg.test('4500,23')).toBe(false)
      expect(reg.test('4500,2322')).toBe(false)
      expect(reg.test('4500,'), '4500, not tested as false').toBe(false)
    })
  })
})
