<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { EnumHelper, resolvePath } from '@/util/object-utils'
  import type { Ownership } from '@/models/Owernship'
  import _isEmpty from 'lodash-es/isEmpty'
  import { Defects, DefectsHelper } from '@/models/Defects'
  import { Deception, DeceptionHelper } from '@/models/Deception'

  const props = defineProps({
    params: Object as any
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
    if (!props.params?.data || !props.params?.path) {
      return undefined
    }
    const ownership = resolvePath(props.params?.data, props.params?.path) as Ownership

    let icon
    let notes = ''
    if (ownership) {
      const hasDeception = ownership.deception > 0
      const hasDefects = ownership.defects > 0
      const hasNotes = !_isEmpty(ownership.notes)
      icon = getIcon(hasDeception, hasDefects, hasNotes)
      notes = `${
        hasDefects
          ? getAdditionalNotes(ownership.defects, Defects, DefectsHelper, 'Defects')
          : ''
      }
      ${
        hasDeception
          ? getAdditionalNotes(
              ownership.deception,
              Deception,
              DeceptionHelper,
              'Deception'
            )
          : ''
      }
      ${ownership.notes ?? ''}`
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      tooltip.value = notes.trim()
    }
    return icon
  })
</script>

<template>
  <VTooltip>
    <span
      v-if="notesIcon"
      :class="`icon-cell ${notesIcon} flex items-center h-6 w-6 hover:text-[var(--vf-primary-darker)] hover:border hover:bg-gray-100 hover:rounded-xl hover:border-current`"
    ></span>
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
    color: #fbbf24;
  }
  .icon-cell.sw-icon-info::before {
    color: #3b82f6;
  }
  .icon-cell.sw-icon-defect::before {
    color: var(--vf-danger);
  }
</style>
