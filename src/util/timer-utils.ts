export function debounce<T>(cb: (...args: T[]) => unknown, duration: number) {
  let timer: NodeJS.Timeout
  return (...args: T[]) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      cb(...args)
    }, duration)
  }
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
