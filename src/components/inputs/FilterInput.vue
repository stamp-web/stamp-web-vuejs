<script setup lang="ts">
  import { ref, watch } from 'vue'
  import _debounce from 'lodash-es/debounce'

  const props = defineProps({
    placeholder: String,
    filterText: String,
    updateRate: Number
  })
  const emit = defineEmits(['filter-changed'])

  const model = ref({
    text: ''
  })
  const filterInput = ref()

  if (props.filterText) {
    model.value.text = props.filterText
  }

  const filterChanged = _debounce(
    () => {
      emit('filter-changed', model.value.text)
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
</script>

<template>
  <Vueform sync v-model="model">
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
