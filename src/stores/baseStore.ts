import { createInstance, type PersistedModel } from '@/models/entityModels'
import type BaseModelService from '@/services/BaseModelService'
import type { EntityList } from '@/models/entityList'
import type { SearchOptions } from '@/stores/types/searchOptions'
import _isEmpty from 'lodash-es/isEmpty'
import _isEqual from 'lodash-es/isEqual'

export type BaseState<T extends PersistedModel> = {
  items: {
    list: T[]
    total: number
    loading: boolean
  }
  inflightPromise: Promise<EntityList<T>> | null
  lastOptions: SearchOptions
}

export type BaseStoreOptions<T extends PersistedModel> = {
  service: BaseModelService<T>
  baseSearchOptions?: SearchOptions
  postFind?: (models: T[], options?: SearchOptions) => T[]
  postCreate?: (model: T) => T
  postUpdate?: (model: T) => T
}

export type BaseStoreComposition<T extends PersistedModel> = {
  state: BaseState<T>
  service: BaseModelService<T>
  remove(model: T): Promise<void>
  find(options?: SearchOptions): Promise<T[]>
  findById(id: number): Promise<T>
  findRandom(): Promise<T | undefined>
  create(model: T): Promise<T>
  update(model: T): Promise<T>
  getCount(): number
}

export function baseStoreComposition<T extends PersistedModel>(
  options: BaseStoreOptions<T>
): BaseStoreComposition<T> {
  const { service } = options
  const baseSearchOptions: SearchOptions = options.baseSearchOptions ?? {}
  const postCreate = options.postCreate ?? ((model: T) => model)
  const postUpdate = options.postUpdate ?? ((model: T) => model)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const postFind = options.postFind ?? ((models: T[], findOptions?: SearchOptions) => models)

  const state = {
    items: {
      list: [],
      total: 0,
      loading: false
    },
    inflightPromise: null,
    lastOptions: {}
  } as BaseState<T>

  // Base actions implementation (remove, find, findById, etc.)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function remove(model: T): Promise<void> {
    const id = model.id
    await service.remove(model)
    const indx = state.items.list.findIndex((e: T) => {
      return e.id === id
    })
    if (indx >= 0) {
      state.items.list.splice(indx, 1)
      state.items.total--
    }
  }

  async function find(options?: SearchOptions): Promise<T[]> {
    const searchOptions = options ?? baseSearchOptions
    // attempt caching for inflight promises.  This will have to be cancelled
    // for finds that have options
    if (
      state.items.loading &&
      state.inflightPromise &&
      (_isEmpty(searchOptions) || _isEqual(searchOptions, state.lastOptions))
    ) {
      await state.inflightPromise
    }
    if (state.items.list.length === 0 || !_isEqual(searchOptions, state.lastOptions)) {
      state.items.loading = true
      state.lastOptions = searchOptions
      state.inflightPromise = service.find(searchOptions)
      const data: EntityList<T> = await state.inflightPromise
      state.items.list.splice(0, state.items.list.length)
      const list = [] as T[]
      data.items.forEach((e) => {
        list.push(createInstance(<T>e))
        state.items.total = data.total
      })
      state.items.list = postFind(list, searchOptions)
      state.items.loading = false
      state.inflightPromise = null
    }
    return state.items.list as T[]
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function findById(id: number) {
    if (state.items.list.length <= 0 || state.lastOptions.$filter) {
      await find()
    }
    return Promise.resolve(state.items.list.find((item) => item.id === id) as T)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function findRandom(): Promise<T | undefined> {
    const list = await service.find()
    if (list.total > 0) {
      const randomIndex = Math.floor(Math.random() * list.total) + 1
      return list.items[randomIndex]
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function create(model: T): Promise<T> {
    const m: T = await service.create(model)
    const list = state.items.list as T[]
    list.push(postCreate(m))
    state.items.total++
    return m
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function update(model: T): Promise<T> {
    let m: T = await service.update(model)
    const index = state.items.list.findIndex((e) => {
      return e.id === m.id
    })
    m = postUpdate ? postUpdate(m) : m
    if (index >= 0) {
      ;(state.items.list as Array<T>)[index] = m
    } else {
      ;(state.items.list as Array<T>).push(m)
    }
    return m
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function getCount(): number {
    return state.items.total
  }

  return {
    state,
    service,
    remove,
    find,
    findById,
    findRandom,
    create,
    update,
    getCount
  }
}
