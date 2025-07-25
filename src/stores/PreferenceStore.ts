import { useStore } from 'pinia-generic'
import type { PiniaStore } from 'pinia-generic'
import type { BaseModelStore } from '@/stores/baseModelStore'
import type BaseModelService from '@/services/BaseModelService'
import { baseModelStore } from '@/stores/baseModelStore'
import PreferenceService from '@/services/PreferenceService'
import type { Preference } from '@/models/Preference'

type PreferenceStoreType = PiniaStore<
  'preferenceStore',
  object,
  object,
  {
    findByNameAndCategory(name: string, category: string): Promise<Preference>
    findByCategory(category: string): Promise<Array<Preference>>
  },
  BaseModelStore<Preference>
>

export const preferenceStore = useStore<PreferenceStoreType, BaseModelStore<Preference>>(
  'preferenceStore',
  {
    state: {},
    getters: {
      service(): BaseModelService<Preference> {
        return PreferenceService
      }
    },
    actions: {
      async findByCategory(category: string): Promise<Array<Preference>> {
        if (this.items.list.length > 0 && !this.lastOptions.$filter) {
          const filtered = this.items.list.filter((p) => p.category === category)
          return Promise.resolve(filtered)
        } else {
          const params = structuredClone(this.baseSearchOptions)
          params.$filter = `(category eq '${category}')`
          return this.find(params)
        }
      },
      async findByNameAndCategory(name: string, category: string): Promise<Preference> {
        if (this.items.list.length <= 0 || this.lastOptions.$filter) {
          await this.find()
        }
        return Promise.resolve(
          this.items.list.find(
            (item) => item.name === name && item.category === category
          ) as Preference
        )
      }
    }
  },
  baseModelStore<Preference>()
)
