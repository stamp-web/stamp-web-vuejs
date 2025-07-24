<script setup lang="ts">
  import { withDefaults, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import type { PagingProps } from '@/components/table/types/pagingProps'

  const { t } = useI18n()

  const props = withDefaults(defineProps<PagingProps>(), {
    totalPages: 0,
    pageNum: 0
  })

  const firstPage = computed(() => {
    return props.pageNum === 1
  })

  const lastPage = computed(() => {
    return props.pageNum === props.totalPages
  })

  defineEmits(['first', 'back', 'next', 'last'])
</script>
<template>
  <div class="flex-col justify-center items-center flex-auto">
    <button @click="$emit('first')" :disabled="firstPage" ref="first" v-tooltip="t('paging.first')">
      <span class="sw-icon-to-start disabled:opacity-50"></span>
    </button>
    <button
      @click="$emit('back')"
      :disabled="firstPage"
      ref="back"
      class="disabled:cursor-not-allowed disabled:opacity-50"
      v-tooltip="t('paging.back')"
    >
      <span class="sw-icon-forward inline-block transform rotate-180 disabled:opacity-50"></span>
    </button>
    <span class="align-middle text-0.5sm contents">
      {{ t('paging.page', { start: props.pageNum, end: props.totalPages }) }}
    </span>
    <button
      @click="$emit('next')"
      :disabled="lastPage"
      ref="next"
      class="disabled:cursor-not-allowed"
      v-tooltip="t('paging.next')"
    >
      <span class="sw-icon-forward disabled:opacity-50"></span>
    </button>
    <button @click="$emit('last')" :disabled="lastPage" ref="last" v-tooltip="t('paging.last')">
      <span class="sw-icon-to-end disabled:opacity-50"></span>
    </button>
  </div>
</template>
