export function debounce(cb: (...args: unknown[]) => unknown, duration: number) {
  let timer: number
  return (...args: unknown[]) => {
    clearTimeout(timer)
    // @ts-ignore
    timer = setTimeout(() => {
      cb(...args)
    }, duration)
  }
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
