export class ColumnDefinition {
  cellClass?: Array<string>
  cellRenderer?: string
  colId?: string
  comparator?: object
  cellRendererParams?: object
  field: string | null
  headerComponentParams?: object
  headerName?: string
  headerTooltip?: string
  maxWidth?: number
  minWidth?: number
  resizable?: boolean = false
  sortable?: boolean = true
  sort?: string
  tooltipField?: string
  tooltipValueGetter?: (params: unknown) => string
  suppressMovable?: boolean = true
  suppressSizeToFit?: boolean = false
  width?: number

  constructor(field: string | null, props?: Partial<Record<string, unknown>>) {
    this.field = field
    Object.assign(this, props)
  }

  static getActionIconProperties() {
    return {
      cellClass: ['!p-0.25 !flex items-center hover:cursor-pointer focus:outline-none'],
      width: 32,
      maxWidth: 32,
      minWidth: 32,
      sortable: false,
      resizable: false,
      suppressSizeToFit: true
    }
  }
  static createActionIconColumn<T = unknown>(
    icon: string,
    fn?: (model: T, rowIndex?: number) => unknown,
    tooltip?: string,
    params?: Partial<Record<string, unknown>>
  ): ColumnDefinition {
    const col = new ColumnDefinition(null, params)
    Object.assign(col, ColumnDefinition.getActionIconProperties())
    col.cellRenderer = 'ClickableIconCellRenderer'
    col.cellRendererParams = {
      icon: icon,
      callbackFn: fn,
      tooltip: tooltip
    }
    return col
  }
}
