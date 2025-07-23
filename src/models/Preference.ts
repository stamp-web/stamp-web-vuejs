import type { PersistedModel } from '@/models/entityModels'

export type Preference = PersistedModel & {
  name: string
  category: string
  value?: string
}

export type PreferencePaths = {
  thumbPath?: string
  imagePath?: string
}
