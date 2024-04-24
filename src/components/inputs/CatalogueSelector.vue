<script lang="ts" setup>
  import { onBeforeMount, ref } from 'vue'
  import { catalogueStore } from '@/stores/catalogueStore'
  import type { Catalogue } from '@/models/Catalogue'

  const cataloguesStore = catalogueStore()
  const items = ref(new Array<Catalogue>())
  const model = defineModel()

  const $props = defineProps({
    label: String,
    search: Boolean,
    name: String,
    rules: String
  })

  onBeforeMount(async () => {
    items.value = await cataloguesStore.find()
  })
</script>
<template>
  <select-element
    :name="$props.name || 'catalogueRef'"
    :native="false"
    :search="$props.search || true"
    :filter-results="true"
    label-prop="name"
    value-prop="id"
    v-model="model"
    :can-deselect="false"
    :append-to-body="true"
    :items="items"
    :label="$props.label || ''"
    :rules="$props.rules || ''"
    autocomplete="off"
  ></select-element>
</template>
