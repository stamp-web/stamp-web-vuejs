export class EntityList<T> {
  items: Array<T> = []
  total: number = 0

  constructor(init?: { items?: Array<T>; total?: number }) {
    if (init) {
      this.items = init.items ?? []
      this.total = init.total ?? 0
    }
  }
}
