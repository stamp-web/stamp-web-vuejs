<script lang="ts" setup>
  import { onBeforeMount, ref } from 'vue'
  import { sellerStore } from '@/stores/sellerStore'
  import type { Seller } from '@/models/entityModels'

  const store = sellerStore()
  const items = ref(new Array<Seller>())

  const $props = defineProps({
    label: String,
    search: Boolean,
    name: String,
    rules: String
  })

  onBeforeMount(async () => {
    items.value = await store.find()
  })
</script>
<template>
  <select-element
    :name="$props.name || 'sellerRef'"
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
