<script lang="ts" setup>
  import { onBeforeMount, ref } from 'vue'
  import { albumStore } from '@/stores/albumStore'
  import type { Album } from '@/models/entityModels'

  const albumsStore = albumStore()
  const items = ref(new Array<Album>())
  const $props = defineProps({
    label: String,
    search: Boolean,
    name: String,
    rules: String
  })

  onBeforeMount(async () => {
    items.value = await albumsStore.find()
  })
</script>
<template>
  <select-element
    :name="$props.name || 'albumRef'"
    :native="false"
    :search="$props.search || true"
    :filter-results="true"
    label-prop="name"
    value-prop="id"
    :append-to-body="true"
    :items="items"
    :label="$props.label || ''"
    :rules="$props.rules || ''"
    autocomplete="off"
  ></select-element>
</template>
