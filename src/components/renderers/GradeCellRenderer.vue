<script setup lang="ts">
  import { computed } from 'vue'
  import { resolvePath } from '@/util/object-utils'
  import { GradeHelper } from '@/models/Grade'

  interface ParamsProps {
    data?: Record<string, unknown>
    path?: string
  }

  const props = defineProps<{
    params?: ParamsProps
  }>()

  const grade = computed(() => {
    const p = props.params
    const resolvedValue = resolvePath(p?.data ?? {}, p?.path ?? '', -1) as number | string
    return GradeHelper.toString(+resolvedValue)
  })
</script>

<template>
  <span>{{ grade }}</span>
</template>
