<script setup lang="ts">
  import { computed } from 'vue'
  import { ConditionHelper } from '@/models/Condition'
  import { resolvePath } from '@/util/object-utils'

  const props = defineProps({
    params: Object as any
  })

  const condition = computed(() => {
    const value = +resolvePath(props.params?.data, props.params?.path, -1)
    return ConditionHelper.toString(value)
  })
</script>

<template>
  <span>{{ condition }}</span>
</template>
