<script setup lang="ts">
  import { computed } from 'vue'

  const props = defineProps({
    total: Number,
    end: Number,
    start: Number
  })

  const startingCount = computed(() => {
    return props.start
  })

  const endingCount = computed(() => {
    return props.end
  })

  const totalCount = computed(() => {
    return props.total
  })
</script>

<template>
  <div class="flex align-middle">
    <span>Total: {{ startingCount }} - {{ endingCount }} of {{ totalCount }}</span>
  </div>
</template>
