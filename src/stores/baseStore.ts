import { createInstance, type PersistedModel } from '@/models/entityModels'
import type BaseModelService from '@/services/BaseModelService'
import type { EntityList } from '@/models/entityList'
import type { SearchOptions } from '@/stores/types/searchOptions'
import _isEmpty from 'lodash-es/isEmpty'
import _isEqual from 'lodash-es/isEqual'
import { ref, type Ref } from 'vue'

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
  state: Ref<BaseState<T>>
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

  const state = ref({
    items: {
      list: [],
      total: 0,
      loading: false
    },
    inflightPromise: null,
    lastOptions: {}
  } as BaseState<T>) as Ref<BaseState<T>>

  async function remove(model: T): Promise<void> {
    const id = model.id
    await service.remove(model)
    const indx = state.value.items.list.findIndex((e: T) => {
      return e.id === id
    })
    if (indx >= 0) {
      state.value.items.list.splice(indx, 1)
      state.value.items.total--
    }
  }

  async function find(options?: SearchOptions): Promise<T[]> {
    const searchOptions = options ?? baseSearchOptions
    // attempt caching for inflight promises.  This will have to be cancelled
    // for finds that have options
    if (
      state.value.items.loading &&
      state.value.inflightPromise &&
      (_isEmpty(searchOptions) || _isEqual(searchOptions, state.value.lastOptions))
    ) {
      await state.value.inflightPromise
    }
    if (state.value.items.list.length === 0 || !_isEqual(searchOptions, state.value.lastOptions)) {
      state.value.items.loading = true
      state.value.lastOptions = searchOptions
      state.value.inflightPromise = service.find(searchOptions)
      const data: EntityList<T> = await state.value.inflightPromise
      state.value.items.list.splice(0, state.value.items.list.length)
      const list = [] as T[]
      data?.items.forEach((e) => {
        list.push(createInstance(<T>e))
        state.value.items.total = data.total
      })
      state.value.items.list = postFind(list, searchOptions)
      state.value.items.loading = false
      state.value.inflightPromise = null
    }
    return state.value.items.list as T[]
  }

  async function findById(id: number) {
    if (state.value.items.list.length <= 0 || state.value.lastOptions.$filter) {
      await find()
    }
    return Promise.resolve(state.value.items.list.find((item) => item.id === id) as T)
  }

  async function findRandom(): Promise<T | undefined> {
    const list = await service.find()
    if (list.total > 0) {
      const randomIndex = Math.floor(Math.random() * list.total)
      return list.items[randomIndex]
    }
  }

  async function create(model: T): Promise<T> {
    const m: T = await service.create(model)
    const list = state.value.items.list as T[]
    list.push(postCreate(m))
    state.value.items.total++
    return m
  }

  async function update(model: T): Promise<T> {
    let m: T = await service.update(model)
    const index = state.value.items.list.findIndex((e) => {
      return e.id === m.id
    })
    m = postUpdate ? postUpdate(m) : m
    if (index >= 0) {
      ;(state.value.items.list as Array<T>)[index] = m
    } else {
      ;(state.value.items.list as Array<T>).push(m)
    }
    return m
  }

  function getCount(): number {
    return state.value.items.total
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
