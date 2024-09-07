<script lang="ts" setup>
  import { watch, ref, useTemplateRef, onMounted } from 'vue'

  const {
    indeterminant = false,
    increment = 5,
    interval = 500,
    value = 0,
    min = 0,
    max = 100
  } = defineProps<{
    indeterminant?: boolean
    increment?: number
    interval?: number
    value?: number
    min?: number
    max?: number
  }>()

  const count = ref(0)
  const limits = ref({
    min: 0,
    max: 100
  })
  const $progressBar = useTemplateRef('$progressBar')

  watch(
    () => [indeterminant],
    () => {
      if (indeterminant) {
        renderIndeterminant()
      }
    }
  )

  watch(
    () => [value],
    () => {
      if (!indeterminant && value) {
        count.value = value
        setValue()
      }
    }
  )

  const renderIndeterminant = () => {
    setInterval(() => {
      count.value = count.value + increment
      setValue(true)
    }, interval)
  }

  const setValue = (resetOnOverflow: boolean = false) => {
    if (count.value > limits.value.max) {
      count.value = resetOnOverflow ? limits.value.min : limits.value.max
    }
    const el = $progressBar.value as Element
    if (el) {
      el.setAttribute('style', `width: ${count.value}%`)
    }
  }

  onMounted(() => {
    if (min) {
      limits.value.min = min
    }
    if (max) {
      if (max < limits.value.min) {
        throw new Error("'max' must be greater than 'min'")
      }
      limits.value.max = max
    }
    count.value = value
      ? Math.max(Math.min(limits.value.max, value), limits.value.min)
      : limits.value.min
    if (indeterminant) {
      renderIndeterminant()
    }
  })

  defineExpose({ count, $progressBar })
</script>
<template>
  <div class="bg-[var(--vf-gray-100)] border-gray-300 border-2 w-full p-0.25 h-full flex">
    <div class="bg-[var(--vf-primary)] h-full left-0 w-1" ref="$progressBar"></div>
  </div>
</template>
