export function debounce(cb: Function, duration: number) {
  let timer: number
  return (...args: any[]) => {
    clearTimeout(timer)
    // @ts-ignore
    timer = setTimeout(() => {
      cb(...args)
    }, duration)
  }
}
