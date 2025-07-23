import BaseService from '@/services/BaseService'
import { ReportResult } from '@/models/ReportResult'
import axios from 'axios'
import { ReportType } from '@/models/ReportType'
import { EnumHelper, resolvePath } from '@/util/object-utils'
import localeUtil from '@/util/locale-utils'
import * as reportStyles from '@/util/reports/report-styles.json'
import type { Stamp } from '@/models/Stamp'
import type { Country } from '@/models/entityModels'
import type { Catalogue } from '@/models/Catalogue'
import { CurrencyCode, CurrencyTools } from '@/models/CurrencyCode'
import { ConditionHelper } from '@/models/Condition'
import type { KeyIndexable } from '@/util/ts/key-accessor'

class ReportService extends BaseService<void> {
  constructor() {
    super()
  }
  getResourceName(): string {
    return 'reports'
  }

  async executeReport(reportType: ReportType, options: any = {}): Promise<ReportResult> {
    const opts = { ...options }
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
    options: {
      model: {
        title: string
        includeNotes: boolean
        includeCountries: boolean
      }
    }
  ) {
    const reportModel = options?.model || {}
    const title = reportModel?.title || localeUtil.t('reports.defaultTitle')
    const includeCountries = reportModel?.includeCountries && true
    const includeNotes = reportModel?.includeNotes && true

    const columns = [
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
      content: [] as Array<any>,
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
    config: {}
  ) {
    const model = {
      body: [] as Array<any>,
      headerRows: 1,
      widths: [] as Array<string>
    }
    // @ts-ignore
    if (config?.cols) {
      const tr = [] as Array<any>
      // @ts-ignore
      config.cols.forEach((col: any) => {
        tr.push({ text: col.name || col.type, style: 'tableHeader' })
        model.widths.push(col.width || 'auto')
      })
      model.body.push(tr)

      stamps.forEach((stamp) => {
        const row = [] as Array<any>
        // @ts-ignore
        config.cols.forEach((col: any) => {
          row.push(this.generateTableCellValue(stamp, col, countries, catalogues))
        })
        model.body.push(row)
      })
    }
    return model
  }

  generateTableCellValue(
    stamp: Stamp,
    col: any,
    countries: Array<Country>,
    catalogues: Array<Catalogue>
  ) {
    let val = resolvePath(stamp, col.value, '')
    let result = ''
    switch (col.type) {
      case 'catalogueNumber':
        result = val
        break
      case 'condition':
        result = ConditionHelper.toString(val)
        break
      case 'currencyValue': {
        // eslint-disable-next-line no-case-declarations
        const catalogueId = +resolvePath(stamp, col.additional[0], -1)
        // eslint-disable-next-line no-case-declarations
        const catalogue = catalogues.find((c) => {
          return c.id === catalogueId
        })
        // eslint-disable-next-line no-case-declarations
        const currencyCode = catalogue?.code || CurrencyCode.USD
        result = CurrencyTools.asCurrencyString(val, currencyCode)
        break
      }
      case 'country': {
        // eslint-disable-next-line no-case-declarations
        const c = countries.find((c) => {
          return c.id === val
        })
        result = c ? c.name : ''
        break
      }
      case 'issues':
        if (val && val.deception > 0) {
          result = '\u0394'
        } else if (val && val.defects > 0) {
          result = '\u00D7'
        }
        break
      case 'notes':
        result = val?.notes || ''
        break
      case 'text':
        col.additional.forEach((a: string) => {
          val += ' ' + (stamp as KeyIndexable)[a] || ''
        })
        result = val
        break
    }
    return result
  }
}

export default new ReportService()
