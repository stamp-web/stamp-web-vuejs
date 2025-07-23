<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { EnumHelper, resolvePath } from '@/util/object-utils'
  import { type Ownership } from '@/models/Ownership'
  import _isEmpty from 'lodash-es/isEmpty'
  import { type Stamp } from '@/models/Stamp'
  import { Defects, DefectsHelper } from '@/models/Defects'
  import { Deception, DeceptionHelper } from '@/models/Deception'

  type CellParams = {
    data: Record<string, unknown>
    path?: string
  }
  const props = defineProps<{
    params?: CellParams
    stamp?: Stamp
    path?: string
  }>()

  const tooltipId = ref(`tooltip-${Math.random().toString(36).substring(2, 9)}`)
  const tooltip = ref<string>('test')

  const getIcon = (hasDeception: boolean, hasDefects: boolean, hasNotes: boolean) => {
    return hasDeception
      ? 'sw-icon-attention'
      : hasDefects
        ? 'sw-icon-defect'
        : hasNotes
          ? 'sw-icon-info'
          : undefined
  }

  interface EnumHelperType {
    toString(value: number): string
  }

  interface EnumType {
    [key: string | number]: string | number
  }

  const getAdditionalNotes = (
    enumValue: number,
    enumType: EnumType,
    helper: EnumHelperType,
    label: string
  ): string => {
    let notes = ''
    const values = EnumHelper.asEnumArray(enumType, enumValue) as number[]
    if (values && values.length > 0) {
      notes += `<b>${label}:</b>`
      values.forEach((value, indx) => {
        notes += ' ' + helper.toString(value)
        if (indx < values.length - 1) {
          notes += ','
        }
      })
      notes += '<br/>'
    }
    return notes
  }

  const notesIcon = computed(() => {
    if ((props.stamp && props.path) || (props.params?.data && props.params?.path)) {
      const obj = props.stamp ? props.stamp : props.params?.data
      const path = props.path ? props.path : props.params?.path || ''
      const ownership = resolvePath(obj, path) as Ownership

      if (ownership) {
        const hasDeception = ownership.deception > 0
        const hasDefects = ownership.defects > 0
        const hasNotes = !_isEmpty(ownership.notes)
        return getIcon(hasDeception, hasDefects, hasNotes)
      }
    }
    return undefined
  })

  const notesContent = computed(() => {
    if ((props.stamp && props.path) || (props.params?.data && props.params?.path)) {
      const obj = props.stamp ? props.stamp : props.params?.data
      const path = props.path ? props.path : props.params?.path || ''
      const ownership = resolvePath(obj, path) as Ownership

      if (ownership) {
        const hasDeception = ownership.deception > 0
        const hasDefects = ownership.defects > 0
        return hasDeception || hasDefects
          ? `${
              hasDefects
                ? getAdditionalNotes(ownership.defects, Defects, DefectsHelper, 'Defects')
                : ''
            } ${
              hasDeception
                ? getAdditionalNotes(ownership.deception, Deception, DeceptionHelper, 'Deception')
                : ''
            } ${ownership.notes ?? ''}`
          : `${ownership.notes ?? ''}`
      }
    }
    return ''
  })

  watch(
    notesContent,
    (newValue) => {
      tooltip.value = newValue.trim()
    },
    { immediate: true }
  )
</script>

<template>
  <VTooltip :id="tooltipId">
    <span v-if="notesIcon" :class="`icon-cell ${notesIcon} flex items-center h-4 w-4`"></span>
    <template #popper>
      <span class="notes-tooltip" v-html="tooltip"></span>
    </template>
  </VTooltip>
</template>
<style>
  .notes-tooltip {
    display: block;
    max-width: 20rem;
  }

  .icon-cell::before {
    margin-left: 0.25rem;
  }

  .icon-cell.sw-icon-attention::before {
    color: #f59e0b;
  }
  .icon-cell.sw-icon-info::before {
    color: #1d4ed8;
  }
  .icon-cell.sw-icon-defect::before {
    color: #b91c1c;
  }
</style>
