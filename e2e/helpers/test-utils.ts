export function generateText(count: number): string {
  let s: string = ''
  const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i: number = 0; i < count; i++) {
    s += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return s
}

export function encodeId(id: string): string {
  return id.replace('.', '\\.')
}
