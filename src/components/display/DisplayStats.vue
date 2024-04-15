<script setup lang="ts">
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const props = defineProps({
    total: Number,
    end: Number,
    start: Number,
    selected: Number
  })
</script>

<template>
  <div class="flex align-middle items-center text-0.5sm">
    <span>{{
      t('display.total-selected', { start: props.start, end: props.end, total: props.total })
    }}</span>
    <span class="ml-4">{{ t('display.selected-count', { count: selected }) }}</span>
  </div>
</template>
