<script setup lang="ts">
  import { computed } from 'vue'
  import type { Stamp } from '@/models/Stamp'
  import type { CellRendererParameters } from '@/components/renderers/types/cellRendererParameters'

  type ColDef = {
    colId?: string
    [key: string]: unknown
  }

  type CellParams = CellRendererParameters & {
    colDef?: ColDef
  }

  const props = defineProps<{
    params?: CellParams
    stamp?: Stamp
  }>()

  const text = computed(() => {
    const params = props.params
    if (params && params.colDef) {
      const data = params.data
      if (data && params.colDef.colId) {
        return data[params.colDef.colId]
      }
    }
    return undefined
  })
</script>

<template>
  <span v-if="text" :class="`overflow-ellipsis overflow-hidden block`" v-tooltip.top="text">{{
    text
  }}</span>
</template>
