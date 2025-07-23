<script setup lang="ts">
  import { computed, onBeforeMount, ref } from 'vue'
  import { stampCollectionStore } from '@/stores/stampCollectionStore'
  import type { StampCollection } from '@/models/entityModels'

  const store = stampCollectionStore()
  const collections = ref<Array<StampCollection>>()

  const props = defineProps({
    params: Object as any
  })

  /**
   * Returns the computed collection name from the given id of the collection for the cell.
   * Analysis has shown that while we could cache the last found item, the time differential is
   * so small, it is not worth the effort to store and process the cache.
   */
  const collectionName = computed(() => {
    const value = props.params ? props.params.value : -1
    return findCollectionName(value)
  })

  const findCollectionName = (value: number) => {
    let found
    if (collections.value) {
       
      found = collections.value.find((collection: StampCollection) => {
        return collection.id === value
      })
    }
    return found ? found.name : ''
  }

  onBeforeMount(async () => {
    collections.value = await store.find()
  })
</script>

<template>
  <span>{{ collectionName }}</span>
</template>
