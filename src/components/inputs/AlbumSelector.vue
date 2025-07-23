<script lang="ts" setup>
  import { computed, onBeforeMount, ref } from 'vue'
  import { albumStore } from '@/stores/albumStore'
  import type { Album } from '@/models/entityModels'
  import type { SelectElement } from '@vueform/vueform'
  import { scrollOnOpen } from '@/components/inputs/select-helper'

  const albumsStore = albumStore()
  const items = ref([] as Album[])
  const $props = defineProps({
    label: String,
    search: Boolean,
    name: String,
    rules: String
  })

  const propName = computed((): string => {
    return $props.name || 'albumRef'
  })

  const onOpen = async (instance: SelectElement) => {
    scrollOnOpen(instance, propName.value)
  }

  onBeforeMount(async () => {
    items.value = await albumsStore.find()
  })
</script>
<template>
  <select-element
    :name="propName"
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
    @open="onOpen"
  ></select-element>
</template>
