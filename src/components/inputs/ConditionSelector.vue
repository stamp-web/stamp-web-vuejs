<script lang="ts" setup>
  import { Condition, ConditionHelper } from '@/models/Condition'
  import type { ValueRecord } from '@/components/inputs/types/valueRecord'

  const $props = defineProps({
    label: String,
    search: { type: Boolean, default: true },
    name: { type: String, default: 'condition' },
    rules: String
  })

  const getConditions = async () => {
    const conditions = new Array<ValueRecord<number>>()
    Object.keys(Condition).forEach((key) => {
      const val = parseInt(key)
      if (!Number.isNaN(val)) {
        conditions.push({ value: val, name: ConditionHelper.toString(val) })
      }
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
    :can-deselect="false"
    :append-to-body="true"
    :items="getConditions"
    :label="$props.label || ''"
    :rules="$props.rules || ''"
    autocomplete="off"
  ></select-element>
</template>
