<script lang="ts" setup>
  import { watch, ref, useTemplateRef, onMounted } from 'vue'

  const $props = defineProps({
    indeterminant: Boolean,
    value: Number,
    min: Number,
    max: Number
  })

  const count = ref(0)
  const limits = ref({
    min: 0,
    max: 100
  })
  const $progressBar = useTemplateRef('$progressBar')

  watch(
    () => [$props.indeterminant],
    () => {
      if ($props.indeterminant) {
        renderIndeterminant()
      }
    }
  )

  watch(
    () => [$props.value],
    () => {
      if (!$props.indeterminant && $props.value) {
        const el = $progressBar.value as Element
        let v = $props.value
        if ($props.value > limits.value.max) {
          v = limits.value.max
        }
        el.setAttribute('style', `width: ${(v / limits.value.max) * 100.0}%`)
      }
    }
  )

  const renderIndeterminant = () => {
    setInterval(() => {
      count.value = count.value + 5
      if (count.value > 100) {
        count.value = 0
      }
      const el = $progressBar.value as Element
      el.setAttribute('style', `width: ${count.value}%`)
    }, 500)
  }

  onMounted(() => {
    if ($props.indeterminant) {
      renderIndeterminant()
    }
    if ($props.min) {
      limits.value.min = +$props.min
    }
    if ($props.max) {
      if (+$props.max < limits.value.min) {
        throw new Error("'max' must be greater than 'min'")
      }
      limits.value.max = +$props.max
    }
  })
</script>
<template>
  <div class="bg-[var(--vf-gray-100)] border-gray-300 border-2 w-full p-0.25 h-full flex">
    <div class="bg-[var(--vf-primary)] h-full left-0 w-1" ref="$progressBar"></div>
  </div>
</template>
