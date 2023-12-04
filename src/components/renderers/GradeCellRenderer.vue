<script setup lang="ts">
  import { computed } from 'vue'
  import { resolvePath } from '@/util/object-utils'
  import { GradeHelper } from '@/models/Grade'

  const props = defineProps({
    params: Object as any
  })

  const grade = computed(() => {
    const value = +resolvePath(props.params?.data, props.params?.path, -1)
    return GradeHelper.toString(value)
  })
</script>

<template>
  <span>{{ grade }}</span>
</template>
