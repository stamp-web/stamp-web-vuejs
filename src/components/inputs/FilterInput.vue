<script setup lang="ts">
  import { onBeforeMount, ref, watch } from 'vue'
  import _debounce from 'lodash-es/debounce'
  import { isNil } from '@/util/object-utils'

  const props = defineProps({
    placeholder: String,
    filterText: String,
    updateRate: Number
  })
  const emit = defineEmits(['filter-changed'])

  const filterInput = ref()
  const form$ = ref()
  const model = ref({
    text: ''
  })

  const filterChanged = _debounce(
    () => {
      if (!isNil(model.value.text)) {
        emit('filter-changed', model.value.text)
      }
    },
    props.updateRate ? +props.updateRate : 250
  )

  watch(
    () => [model.value.text],
    () => {
      filterChanged()
    },
    { deep: true }
  )
  const clear = () => {
    model.value.text = ''
    filterChanged()
  }

  onBeforeMount(() => {
    if (props.filterText) {
      model.value.text = props.filterText
    }
  })
</script>

<template>
  <Vueform sync v-model="model" ref="form$" :endpoint="false">
    <TextElement
      ref="filterInput"
      :placeholder="`${props.placeholder || 'Filter'}`"
      size="sm"
      autocomplete="none"
      :floating="false"
      name="text"
    >
      <template #addon-after>
        <span class="sw-icon-cancel" @click="clear"></span>
      </template>
    </TextElement>
  </Vueform>
</template>
