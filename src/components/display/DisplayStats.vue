<script setup lang="ts">
  const props = defineProps({
    total: Number,
    end: Number,
    start: Number,
    selected: Number
  })
</script>

<template>
  <div class="flex align-middle text-0.5sm">
    <span>Total: {{ props.start }} - {{ props.end }} of {{ props.total }}</span>
    <span class="ml-4">Selected: {{ selected }}</span>
  </div>
</template>
