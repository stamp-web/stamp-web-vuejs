import BaseService from '@/services/BaseService'
import { ReportResult } from '@/models/ReportResult'
import axios from 'axios'
import { ReportType } from '@/models/ReportType'
import { EnumHelper, resolvePath } from '@/util/object-utils'
import localeUtil from '@/util/locale-utils'
import * as reportStyles from '@/util/reports/report-styles.json'
import type { Stamp } from '@/models/Stamp'
import type { Ownership } from '@/models/Ownership'
import type { Country } from '@/models/entityModels'
import type { Catalogue } from '@/models/Catalogue'
import { CurrencyCode, CurrencyTools } from '@/models/CurrencyCode'
import { ConditionHelper } from '@/models/Condition'

import {
  type ReportColumn,
  type TableConfig,
  type ReportOptions
} from '@/services/types/reportTypes'

class ReportService extends BaseService<void> {
  constructor() {
    super()
  }
  getResourceName(): string {
    return 'reports'
  }

  async executeReport(reportType: ReportType, options: object = {}): Promise<ReportResult> {
    const opts = { ...options }
    // @ts-expect-error: need to create a proper type for options
    opts.$reportType = EnumHelper.enumToString(ReportType, reportType)
    const response = await axios.get(this.createURI(opts))
    const result = new ReportResult()
    result.code = response.data.code
    result.value = Number.parseFloat(response.data.value)
    return result
  }

  buildReport(
    stamps: Array<Stamp>,
    countries: Array<Country>,
    catalogues: Array<Catalogue>,
    reportValue: string,
    options: ReportOptions
  ) {
    const reportModel = options?.model || {}
    const title = reportModel?.title || localeUtil.t('reports.defaultTitle')
    const includeCountries = reportModel?.includeCountries && true
    const includeNotes = reportModel?.includeNotes && true

    const columns: ReportColumn[] = [
      { name: ' ', type: 'issues', value: 'stampOwnerships[0]' },
      {
        name: localeUtil.t('reports.number'),
        type: 'catalogueNumber',
        value: 'activeCatalogueNumber.number'
      },
      {
        name: localeUtil.t('reports.description'),
        type: 'text',
        value: 'rate',
        additional: ['description'],
        width: '*'
      },
      {
        name: localeUtil.t('reports.condition'),
        type: 'condition',
        value: 'stampOwnerships[0].condition'
      },
      {
        name: localeUtil.t('reports.value'),
        type: 'currencyValue',
        value: 'activeCatalogueNumber.value',
        additional: ['activeCatalogueNumber.catalogueRef']
      }
    ]
    if (includeCountries) {
      columns.splice(1, 0, {
        name: localeUtil.t('reports.country'),
        type: 'country',
        value: 'countryRef'
      })
    }
    if (includeNotes) {
      const index = includeCountries ? 4 : 3
      columns.splice(index, 0, {
        name: localeUtil.t('reports.notes'),
        type: 'notes',
        value: 'stampOwnerships[0]',
        additional: [],
        width: '*'
      })
    }

    const tmodel = this.generateTableModel(stamps, countries, catalogues, {
      cols: columns
    })
    const styles = this.getStandardStyleDefinition()
    const opts = {
      content: [] as Array<unknown>,
      styles: {}
    }

    opts.content.push(this.generateText(`Report: ${title}`, 'header'))
    opts.content.push(this.generateText(`Total number of stamps: ${stamps.length}`, 'text'))
    opts.content.push(this.generateText(`Total value: ${reportValue}`, 'text'))
    opts.content.push({
      table: tmodel,
      style: 'table',
      layout: {
        hLineColor: () => {
          return '#aaa'
        },
        vLineColor: () => {
          return '#aaa'
        }
      }
    })
    opts.styles = styles
    return opts
  }
  generateText(text: string = '', style: string = 'header') {
    return {
      text: text,
      style: style
    }
  }
  getStandardStyleDefinition() {
    return reportStyles
  }

  generateTableModel(
    stamps: Array<Stamp>,
    countries: Array<Country>,
    catalogues: Array<Catalogue>,
    config: TableConfig
  ) {
    const model = {
      body: [] as unknown[],
      headerRows: 1,
      widths: [] as string[]
    }
    if (config?.cols) {
      const tr = [] as Array<object>
      config.cols.forEach((col: ReportColumn) => {
        tr.push({ text: col.name || col.type, style: 'tableHeader' })
        model.widths.push(col.width || 'auto')
      })
      model.body.push(tr)

      stamps.forEach((stamp) => {
        const row = [] as Array<unknown>
        config.cols.forEach((col: ReportColumn) => {
          row.push(this.generateTableCellValue(stamp, col, countries, catalogues))
        })
        model.body.push(row)
      })
    }
    return model
  }

  generateTableCellValue(
    stamp: Stamp,
    col: ReportColumn,
    countries: Array<Country>,
    catalogues: Array<Catalogue>
  ) {
    const val = resolvePath(stamp, col.value, '') as unknown
    let ownership: Ownership
    let result = '' as unknown
    switch (col.type) {
      case 'catalogueNumber':
        result = val
        break
      case 'condition':
        result = ConditionHelper.toString(val as number)
        break
      case 'currencyValue':
        if (!col.additional?.length) {
          return ''
        }
        const catalogueId = +(resolvePath(stamp, col.additional[0], -1) as string | number)

        const catalogue = catalogues.find((c) => {
          return c.id === catalogueId
        })

        const currencyCode = catalogue?.code || CurrencyCode.USD
        result = CurrencyTools.asCurrencyString(val as number, currencyCode)
        break
      case 'country':
        const c = countries.find((c) => {
          return c.id === val
        })
        result = c ? c.name : ''
        break
      case 'issues':
        ownership = val as Ownership
        if (ownership && ownership.deception > 0) {
          result = '\u0394'
        } else if (ownership && ownership.defects > 0) {
          result = '\u00D7'
        }
        break
      case 'notes':
        ownership = val as Ownership
        result = ownership?.notes || ''
        break
      case 'text':
        if (!col.additional?.length) {
          return ''
        }
        let textResult = String(val || '')
        col.additional.forEach((key: string) => {
          const additionalValue = resolvePath(stamp, key, '')
          textResult += ` ${additionalValue || ''}`
        })
        result = textResult
        break
    }
    return result
  }
}

export default new ReportService()
