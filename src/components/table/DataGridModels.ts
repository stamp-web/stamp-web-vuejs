export class ColumnDefinition {
  cellClass?: Array<String>
  cellRenderer?: string
  cellRendererParams?: object
  field: string | null
  headerName?: string
  headerTooltip?: string
  maxWidth?: number
  minWidth?: number
  resizable?: boolean = false
  sortable?: boolean = true
  suppressMovable?: boolean = true
  suppressSizeToFit?: boolean = false
  width?: number

  constructor(field: string | null) {
    this.field = field
  }

  static createActionIconColumn(icon: string, eventName: string): ColumnDefinition {
    const col = new ColumnDefinition(null)
    Object.assign(col, {
      cellClass: ['!p-0.25 !flex items-center hover:cursor-pointer focus:outline-none'],
      width: 32,
      maxWidth: 32,
      minWidth: 32,
      sortable: false,
      resizable: false
    })
    col.suppressSizeToFit = true
    col.cellRenderer = 'ClickableIconCellRenderer'
    col.cellRendererParams = {
      icon: icon,
      callback: eventName
    }
    return col
  }
}
