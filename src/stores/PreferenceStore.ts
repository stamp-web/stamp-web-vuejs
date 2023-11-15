import { useStore } from 'pinia-generic'
import type { PiniaStore } from 'pinia-generic'
import type { BaseModelStore } from '@/stores/baseModelStore'
import type BaseService from '@/services/BaseService'
import { baseModelStore } from '@/stores/baseModelStore'
import PreferenceService from '@/services/PreferenceService'
import type { Preference } from '@/models/Preference'

type PreferenceStoreType = PiniaStore<
  'preferenceStore',
  {},
  {},
  {},
  BaseModelStore<Preference>
>

export const preferenceStore = useStore<PreferenceStoreType, BaseModelStore<Preference>>(
  'preferenceStore',
  {
    state: {},
    getters: {
      service(): BaseService<Preference> {
        return PreferenceService
      }
    }
  },
  baseModelStore<Preference>()
)
