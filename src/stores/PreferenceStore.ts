import { useStore } from 'pinia-generic'
import type { PiniaStore } from 'pinia-generic'
import type { BaseModelStore } from '@/stores/baseModelStore'
import type BaseModelService from '@/services/BaseModelService'
import { baseModelStore } from '@/stores/baseModelStore'
import PreferenceService from '@/services/PreferenceService'
import type { Preference } from '@/models/Preference'

type PreferenceStoreType = PiniaStore<
  'preferenceStore',
  {},
  {},
  {
    findByNameAndCategory(name: string, category: string): Promise<Preference>
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
      async findByNameAndCategory(name: string, category: string): Promise<Preference> {
        if (this.items.list.length <= 0) {
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
