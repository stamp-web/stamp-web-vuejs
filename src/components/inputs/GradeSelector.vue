<script lang="ts" setup>
  import { GradeHelper, Grade } from '@/models/Grade'

  const $props = defineProps({
    label: String,
    search: { type: Boolean, default: true },
    name: { type: String, default: 'grade' },
    rules: String
  })

  const getGrades = async () => {
    const grades = new Array<any>()
    // @ts-ignore
    Object.keys(Grade).forEach((key) => {
      const val = parseInt(key)
      if (!Number.isNaN(val)) {
        grades.push({ value: val, name: GradeHelper.toString(val) })
      }
    })
    return Promise.resolve(grades)
  }
</script>
<template>
  <select-element
    :name="$props.name || 'grade'"
    :native="false"
    :search="false"
    label-prop="name"
    value-prop="value"
    :can-deselect="false"
    :append-to-body="true"
    :items="getGrades"
    :label="$props.label || ''"
    :rules="$props.rules || ''"
  ></select-element>
</template>
