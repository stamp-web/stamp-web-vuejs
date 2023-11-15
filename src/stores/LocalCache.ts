class LocalCache {
  constructor() {}

  getItem(key: string): string {
    const v = localStorage.getItem(key)
    return v ? v : ''
  }

  setItem(key: string, data: string) {
    localStorage.setItem(key, data)
  }

  removeItem(key: string) {
    localStorage.removeItem(key)
  }
}

export default new LocalCache()
