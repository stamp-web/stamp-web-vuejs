<script setup lang="ts">
  import { computed } from 'vue'

  const {
    value = '',
    state = 'secondary'
  } = defineProps<{
    value?: string
    state?: 'active' | 'secondary' | 'tertiary'
  }>()

  const stateClasses = computed(() => {
    switch (state) {
      case 'active':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200/50 shadow-sm'
      case 'tertiary':
        return 'bg-blue-100 text-blue-800 border-blue-200/50'
      case 'secondary':
      default:
        return 'bg-gray-100 text-gray-500 border-gray-200/50'
    }
  })
</script>

<template>
  <span
    class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border"
    :class="stateClasses"
  >
    <slot>{{ value }}</slot>
  </span>
</template>
