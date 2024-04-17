<script lang="ts" setup>
  import { albumStore } from '@/stores/albumStore'
  import { uuidv4 } from '@/util/object-utils'

  const albumsStore = albumStore()

  const $props = defineProps({
    label: String,
    search: { type: Boolean, default: true },
    name: { type: String, default: 'albumRef' },
    rules: String
  })

  const getAlbums = async (query: string) => {
    let params = albumsStore.baseSearchOptions
    if (query) {
      // @ts-ignore
      params.$filter = `(contains(name,'${query}'))`
    }
    return await albumsStore.find(params)
  }
</script>
<template>
  <select-element
    :name="$props.name || 'albumRef'"
    :native="false"
    :search="$props.search || false"
    :filter-results="false"
    label-prop="name"
    value-prop="id"
    :can-deselect="false"
    :append-to-body="true"
    :items="getAlbums"
    :label="$props.label || ''"
    :rules="$props.rules || ''"
    :autocomplete="uuidv4()"
  ></select-element>
</template>
