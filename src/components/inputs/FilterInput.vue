<script setup lang="ts">
import { ref, watch } from 'vue'

const model = ref({
  text: ''
})
const filterInput = ref()

const props = defineProps({
  placeholder: String,
  filterText: String
})

if (props.filterText) {
  model.value.text = props.filterText
}
const emit = defineEmits(['filter-changed'])

watch(
  () => [model.value.text],
  () => {
    emit('filter-changed', model.value.text)
  }
)
const clear = () => {
  model.value.text = ''
  emit('filter-changed', model.value.text)
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
