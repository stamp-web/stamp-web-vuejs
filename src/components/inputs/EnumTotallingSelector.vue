<script lang="ts" setup>
  import { EnumHelper } from '@/util/object-utils'
  import { onBeforeMount, ref } from 'vue'

  const items = ref()

  const $props = defineProps({
    type: Object,
    tokenName: String
  })

  onBeforeMount(() => {
    if ($props.type && $props.tokenName) {
      items.value = EnumHelper.buildEnumListModel($props.type, $props.tokenName)
    }
  })
</script>
<template>
  <TagsElement
    :native="false"
    :name="`_${$props.tokenName}`"
    :append-to-body="true"
    :items="items"
    label-prop="label"
    value-prop="value"
  ></TagsElement>
</template>
