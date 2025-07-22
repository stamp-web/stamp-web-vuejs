import { describe, it, expect } from 'vitest'
import ReportService from '../ReportService'
import { type Stamp, StampModelHelper } from '@/models/Stamp'
import type { Catalogue } from '@/models/Catalogue'
import type { Country } from '@/models/entityModels'
import { createInstance } from '@/models/entityModels'
import { CurrencyCode } from '@/models/CurrencyCode'
import { Condition } from '@/models/Condition'
import type { CatalogueNumber } from '@/models/CatalogueNumber.ts'

describe('ReportingService', () => {
  describe('buildReport', () => {
    it('simple results', () => {
      const stamps: Array<Stamp> = []
      for (let i = 0; i < 5; i++) {
        const s = StampModelHelper.newInstance()
        Object.assign(s, { rate: `${i + 1}d`, description: 'red' })
        const cn = s.activeCatalogueNumber ?? ({} as CatalogueNumber)
        cn.number = `test-${i}`
        cn.catalogueRef = 23
        cn.condition = 0
        cn.value = i + 0.5
        stamps.push(s)
      }

      const countries = [createInstance({ id: 45, name: 'Test' }) as Country]
      const catalogues = [
        createInstance({ id: 23, name: 'Test Cat', code: CurrencyCode.EUR }) as Catalogue
      ]

      const opts = ReportService.buildReport(stamps, countries, catalogues, '$100.00', {
        model: {
          title: 'test title',
          includeNotes: true,
          includeCountries: true
        }
      })
      expect(opts.styles).toBeDefined()
      expect(opts.content).toBeDefined()
    })
  })

  describe('generateText', () => {
    it('no style', () => {
      const obj = ReportService.generateText('some text')
      expect(obj.text).toBe('some text')
      expect(obj.style).toBe('header')
    })

    it('with body style', () => {
      const obj = ReportService.generateText('some text', 'body')
      expect(obj.text).toBe('some text')
      expect(obj.style).toBe('body')
    })

    it('no value', () => {
      const obj = ReportService.generateText()
      expect(obj.text).toBe('')
      expect(obj.style).toBe('header')
    })
  })

  describe('generateTableCellValue', () => {
    it('description', () => {
      const s = StampModelHelper.newInstance(false)
      s.rate = '1d'
      s.description = 'red'

      const obj = ReportService.generateTableCellValue(
        s,
        {
          name: 'Description',
          type: 'text',
          value: 'rate',
          additional: ['description']
        },
        new Array<Country>(),
        new Array<Catalogue>()
      )
      expect(obj).toBe('1d red')
    })

    it('catalogue number', () => {
      const stamp = StampModelHelper.newInstance(false)
      if (stamp.activeCatalogueNumber) {
        stamp.activeCatalogueNumber.number = '23a'
        const obj = ReportService.generateTableCellValue(
          stamp,
          {
            name: 'Number',
            type: 'catalogueNumber',
            value: 'activeCatalogueNumber.number'
          },
          new Array<Country>(),
          new Array<Catalogue>()
        )
        expect(obj).toBe('23a')
      }
    })

    it('catalogue condition', () => {
      const s = StampModelHelper.newInstance(false)
      if (s.activeCatalogueNumber) {
        s.activeCatalogueNumber.condition = Condition.MINT
        const obj = ReportService.generateTableCellValue(
          s,
          {
            name: 'Condition',
            type: 'condition',
            value: 'activeCatalogueNumber.condition'
          },
          new Array<Country>(),
          new Array<Catalogue>()
        )
        expect(obj).toBe('Mint')
      }
    })

    it('catalogue value', () => {
      const s = StampModelHelper.newInstance(false)
      if (s.activeCatalogueNumber) {
        s.activeCatalogueNumber.value = 500.25
        s.activeCatalogueNumber.catalogueRef = 23

        const obj = ReportService.generateTableCellValue(
          s,
          {
            name: 'Value',
            type: 'currencyValue',
            value: 'activeCatalogueNumber.value',
            additional: ['activeCatalogueNumber.catalogueRef']
          },
          new Array<Country>(),
          [createInstance({ id: 23, name: 'some catalogue', code: CurrencyCode.EUR }) as Catalogue]
        )
        expect(obj).toBe('€500.25')
      }
    })

    it('country name', () => {
      const s = StampModelHelper.newInstance(false)
      s.countryRef = 123
      const obj = ReportService.generateTableCellValue(
        s,
        {
          name: 'Country',
          type: 'country',
          value: 'countryRef'
        },
        [createInstance({ id: 123, name: 'Test Country' })],
        new Array<Catalogue>()
      )
      expect(obj).toBe('Test Country')
    })

    it('contains deception', () => {
      const s = StampModelHelper.newInstance(false)
      s.stampOwnerships[0].deception = 15
      const obj = ReportService.generateTableCellValue(
        s,
        {
          name: 'issues',
          type: 'issues',
          value: 'stampOwnerships[0]',
          additional: []
        },
        new Array<Country>(),
        new Array<Catalogue>()
      )
      expect(obj).toBe('Δ')
    })

    it('contains defects', () => {
      const s = StampModelHelper.newInstance(false)
      s.stampOwnerships[0].defects = 1
      const obj = ReportService.generateTableCellValue(
        s,
        {
          name: 'issues',
          type: 'issues',
          value: 'stampOwnerships[0]',
          additional: []
        },
        new Array<Country>(),
        new Array<Catalogue>()
      )
      expect(obj).toBe('×')
    })

    it('contains notes', () => {
      const s = StampModelHelper.newInstance(false)
      s.stampOwnerships[0].notes = 'these are the notes'
      const obj = ReportService.generateTableCellValue(
        s,
        {
          name: 'notes',
          type: 'notes',
          value: 'stampOwnerships[0]',
          additional: []
        },
        new Array<Country>(),
        new Array<Catalogue>()
      )
      expect(obj).toBe('these are the notes')
    })

    it('no notes', () => {
      const s = StampModelHelper.newInstance(false)
      s.stampOwnerships[0].notes = undefined
      const obj = ReportService.generateTableCellValue(
        s,
        {
          name: 'notes',
          type: 'notes',
          value: 'stampOwnerships[0]',
          additional: []
        },
        new Array<Country>(),
        new Array<Catalogue>()
      )
      expect(obj).toBe('')
    })
  })
})
