<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { computed } from 'vue'

  const { t } = useI18n()

  const props = defineProps({
    total: Number,
    end: Number,
    start: Number,
    selected: Number
  })

  const key = computed(() => {
    return props?.total ?? 0 > 0 ? 'display.total-selected' : 'display.total-selected_zero'
  })
</script>

<template>
  <div class="flex align-middle items-center text-0.5sm">
    <span>{{ t(key, { start: props.start, end: props.end, total: props.total }) }}</span>
    <span class="ml-4">{{ t('display.selected-count', { count: selected }) }}</span>
  </div>
</template>
