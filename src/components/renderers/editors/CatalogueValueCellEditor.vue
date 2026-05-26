<script setup lang="ts">
  import { nextTick, onMounted, ref } from 'vue'
  import type { AgColumn, RowNode } from 'ag-grid-community'

  type ParamsType = {
    api?: unknown
    column?: AgColumn
    data?: unknown
    colDef?: unknown
    node?: RowNode
    rowIndex?: number
    stopEditing?: unknown
    value?: string
  }

  type PropsType = {
    params: ParamsType
  }

  const input = ref<HTMLInputElement>()
  const model = ref<string>()

  const props = defineProps<PropsType>()

  const keyStroke = (event: KeyboardEvent) => {
    model.value = input.value?.value ?? '0.0'

    const stopEditing = props.params?.stopEditing

    if (typeof stopEditing === 'function') {
      if (event.key === 'Enter') {
        stopEditing()
      } else if (event.key === 'Escape') {
        stopEditing(true)
      }
    }
    return true
  }

  const getValue = () => {
    const v = Number.parseFloat(model.value ?? '0.0')
    return Number.isNaN(v) ? 0.0 : v
  }

  onMounted(async () => {
    if (input.value) {
      input.value.value = props.params.value ?? '0.0'
      model.value = input.value.value
      await nextTick()
      input.value.focus()
    }
  })

  defineExpose({ getValue, model })
</script>

<template>
  <span>
    <Vueform sync>
      <TextElement
        name="catalogue-value"
        ref="input"
        v-model="model"
        input-type="number"
        rules="required|max:25"
        autocomplete="off"
        @keydown="keyStroke"
      ></TextElement>
    </Vueform>
  </span>
</template>
