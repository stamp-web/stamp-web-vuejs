export class ColumnDefinition {
  data: string | null
  title: string
  defaultContent: any
  icon?: string
  eventName?: string
  width? : string

  constructor(data: string | null, title: string = '', defaultContent: any = '') {
    this.data = data
    this.title = title
    this.defaultContent = defaultContent
  }

  static createActionIconColumn(
    icon: string,
    eventName: string,
    title: string = ''
  ): ColumnDefinition {
    const col = new ColumnDefinition(
      null,
      '',
      `<span class="${icon} __${eventName}__"></span>`
    )
    col.icon = icon
    col.eventName = eventName
    col.width = '0.5rem'
    return col
  }
}
