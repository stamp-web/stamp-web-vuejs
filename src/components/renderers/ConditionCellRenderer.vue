<script setup lang="ts">
  import { computed } from 'vue'
  import { ConditionHelper } from '@/models/Condition'
  import { resolvePath } from '@/util/object-utils'
  import type { CellRendererParameters } from '@/components/renderers/types/cellRendererParameters'

  const props = defineProps<{
    params?: CellRendererParameters
  }>()

  const condition = computed(() => {
    const rawValue = resolvePath(props.params?.data, props.params?.path, -1)
    const value = Number(rawValue)
    return Number.isFinite(value) ? ConditionHelper.toString(value) : ''
  })
</script>

<template>
  <span>{{ condition }}</span>
</template>
