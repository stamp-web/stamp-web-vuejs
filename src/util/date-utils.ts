import dayjs from 'dayjs'

export function toISOString(date: Date): string {
  return new Date(date.getTime() + date.getTimezoneOffset() * 60000).toISOString()
}

export function asLocalDate(pureDate: string | Date): Date {
  if (pureDate) {
    const dt = `${dayjs(pureDate).format('YYYY-MM-DD')}T23:59:00Z`
    return new Date(dt)
  }
  return new Date(new Date().toISOString())
}
export function parseDateString(dateStr: string): Date | undefined {
  const regex = /^datetimeoffset'(\d\d\d\d-\d\d-\d\d)T.*'$/g
  const result = regex.exec(dateStr)
  if (result && result.length > 1) {
    const d = new Date(result[1])
    return new Date(d.getTime() + d.getTimezoneOffset() * 60000)
  }
  return undefined
}
