<script setup lang="ts">
  import { computed } from 'vue'
  import { resolvePath } from '@/util/object-utils'
  import { GradeHelper } from '@/models/Grade'
  import type { CellRendererParameters } from '@/components/renderers/types/cellRendererParameters'

  const props = defineProps<{
    params?: CellRendererParameters
  }>()

  const grade = computed(() => {
    const rawValue = resolvePath(props.params?.data, props.params?.path, -1)
    const value = Number(rawValue)
    return Number.isFinite(value) ? GradeHelper.toString(value) : ''
  })
</script>

<template>
  <span>{{ grade }}</span>
</template>
