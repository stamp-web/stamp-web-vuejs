<script setup lang="ts">
  import { computed, onBeforeMount, ref } from 'vue'
  import { stampCollectionStore } from '@/stores/stampCollectionStore'
  import type { StampCollection } from '@/models/entityModels'

  const store = stampCollectionStore()
  const collections = ref()

  const props = defineProps({
    params: Object as any
  })

  const collectionName = computed(() => {
    const value = props.params.value
    if (collections.value) {
      const filtered = collections.value.filter((collection: StampCollection) => {
        return collection.id === value
      })
      return filtered[0].name
    }
  })

  onBeforeMount(async () => {
    collections.value = await store.find()
  })
</script>

<template>
  <span>{{ collectionName }}</span>
</template>
