<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { ConditionHelper } from '@/models/Condition'
  import { resolvePath } from '@/util/object-utils'

  interface ParamsProps {
    data?: Record<string, unknown>
    path?: string
  }

  const props = defineProps<{
    params?: ParamsProps
  }>()

  const condition = computed(() => {
    const p = props.params
    const resolvedValue = resolvePath(p?.data ?? {}, p?.path ?? '', -1) as number | string
    return ConditionHelper.toString(+resolvedValue)
  })
</script>

<template>
  <span>{{ condition }}</span>
</template>
