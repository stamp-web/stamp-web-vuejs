<script lang="ts" setup>
  import { CatalogueModelHelper, CatalogueType } from '@/models/Catalogue'

  const $props = defineProps({
    label: String,
    search: { type: Boolean, default: true },
    name: { type: String, default: 'type' },
    rules: String
  })

  const items = async () => {
    const types: (any)[] = []
    // @ts-ignore
    Object.keys(CatalogueType).forEach((key) => {
      const val = parseInt(key)
      if (!Number.isNaN(val)) {
        types.push({ value: val, name: CatalogueModelHelper.toString(val) })
      }
    })
    return Promise.resolve(types)
  }
</script>
<template>
  <select-element
    :name="$props.name || 'type'"
    :native="false"
    :search="false"
    label-prop="name"
    value-prop="value"
    :can-deselect="false"
    :can-clear="false"
    :append-to-body="true"
    :items="items"
    :label="$props.label || ''"
    :rules="$props.rules || ''"
  ></select-element>
</template>
