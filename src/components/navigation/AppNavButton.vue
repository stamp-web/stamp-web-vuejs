<template>
  <RouterLink
    :exact-active-class="'bg-gray-600 text-gray-50'"
    class="flex items-center max-h-16 min-h-8 text-gray-100 mb-1 p-2 w-full rounded hover:bg-gray-700"
    :to="props.link || '/'"
    ><span class="align-middle text-center w-full">{{ props.title }}</span></RouterLink
  >
</template>
<script setup lang="ts">
  import { RouterLink } from 'vue-router'

  const props = defineProps({
    title: String,
    link: String
  })
</script>
