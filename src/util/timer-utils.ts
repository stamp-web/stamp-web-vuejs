export function debounce(cb: (...args: unknown[]) => unknown, duration: number) {
  let timer: NodeJS.Timeout
  return (...args: unknown[]) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      cb(...args)
    }, duration)
  }
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
