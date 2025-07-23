export interface ReportColumn {
  name: string
  type: 'issues' | 'catalogueNumber' | 'text' | 'condition' | 'currencyValue' | 'country' | 'notes'
  value: string
  additional?: string[]
  width?: string
}

export interface TableConfig {
  cols: ReportColumn[]
}

export interface ReportOptions {
  model: {
    title: string
    includeNotes: boolean
    includeCountries: boolean
  }
}
