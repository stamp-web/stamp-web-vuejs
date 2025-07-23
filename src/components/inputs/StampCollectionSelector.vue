<script lang="ts" setup>
  import { onBeforeMount, ref } from 'vue'
  import { stampCollectionStore } from '@/stores/stampCollectionStore'
  import type { StampCollection } from '@/models/entityModels'

  const store = stampCollectionStore()
  const items = ref([] as StampCollection[])
  const $props = defineProps({
    label: String,
    search: { type: Boolean, default: true },
    name: { type: String, default: 'stampCollectionRef' },
    rules: String
  })

  onBeforeMount(async () => {
    items.value = await store.find()
  })
</script>
<template>
  <select-element
    :name="$props.name || 'stampCollectionRef'"
    :native="false"
    :search="$props.search || true"
    :filter-results="true"
    label-prop="name"
    value-prop="id"
    :can-deselect="false"
    :append-to-body="true"
    :items="items"
    :label="$props.label || ''"
    :rules="$props.rules || ''"
    autocomplete="off"
  ></select-element>
</template>
