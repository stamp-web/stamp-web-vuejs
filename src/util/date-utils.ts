export function toISOString(date: Date): String {
  return new Date(date.getTime() + date.getTimezoneOffset() * 60000).toISOString()
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
