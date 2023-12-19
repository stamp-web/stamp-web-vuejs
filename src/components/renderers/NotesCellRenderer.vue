<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { EnumHelper, resolvePath } from '@/util/object-utils'
  import type { Ownership } from '@/models/Owernship'
  import _isEmpty from 'lodash-es/isEmpty'
  import { Defects, DefectsHelper } from '@/models/Defects'
  import { Deception, DeceptionHelper } from '@/models/Deception'

  const props = defineProps({
    params: Object as any,
    stamp: Object as any,
    path: String
  })

  const tooltip = ref('')

  const getIcon = (hasDeception: boolean, hasDefects: boolean, hasNotes: boolean) => {
    return hasDeception
      ? 'sw-icon-attention'
      : hasDefects
        ? 'sw-icon-defect'
        : hasNotes
          ? 'sw-icon-info'
          : undefined
  }

  const getAdditionalNotes = (
    enumValue: number,
    enumType: any,
    helper: any,
    label: string
  ): string => {
    let notes = ''
    const values = EnumHelper.asEnumArray(enumType, enumValue)
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
      const path = props.path ? props.path : props.params?.path
      const ownership = resolvePath(obj, path) as Ownership

      let icon
      let notes = ''
      if (ownership) {
        const hasDeception = ownership.deception > 0
        const hasDefects = ownership.defects > 0
        const hasNotes = !_isEmpty(ownership.notes)
        icon = getIcon(hasDeception, hasDefects, hasNotes)
        notes = `${
          hasDefects ? getAdditionalNotes(ownership.defects, Defects, DefectsHelper, 'Defects') : ''
        }
      ${
        hasDeception
          ? getAdditionalNotes(ownership.deception, Deception, DeceptionHelper, 'Deception')
          : ''
      }
      ${ownership.notes ?? ''}`
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        tooltip.value = notes.trim()
      }
      return icon
    }
    return undefined
  })
</script>

<template>
  <VTooltip>
    <span v-if="notesIcon" :class="`icon-cell ${notesIcon} flex items-center h-3 w-3`"></span>
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
