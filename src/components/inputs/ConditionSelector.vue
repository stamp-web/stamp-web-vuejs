<script lang="ts" setup>
  import { Condition, ConditionHelper } from '@/models/Condition'

  const $props = defineProps({
    label: String,
    search: { type: Boolean, default: true },
    name: { type: String, default: 'condition' },
    rules: String
  })

  const getConditions = async () => {
    const conditions = new Array<any>()
    // @ts-ignore
    Object.keys(Condition).forEach((key) => {
      const val = parseInt(key)
      conditions.push({ value: val, name: ConditionHelper.toString(val) })
    })
    return Promise.resolve(conditions)
  }
</script>
<template>
  <select-element
    :name="$props.name || 'condition'"
    :native="false"
    :search="false"
    label-prop="name"
    value-prop="value"
    :items="getConditions"
    :label="$props.label || ''"
    :rules="$props.rules || ''"
  ></select-element>
</template>
