<script setup lang="ts">
  import { onBeforeMount, ref, watch } from 'vue'
  import { isNil } from '@/util/object-utils'
  import { debounce } from '@/util/timer-utils'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const props = defineProps({
    placeholder: String,
    label: String,
    disabled: Boolean,
    filterText: String,
    updateRate: Number
  })
  const emit = defineEmits(['filter-changed'])

  const filterInput = ref()
  const form$ = ref()
  const model = ref({
    text: ''
  })

  const filterChanged = debounce(
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
  <Vueform size="sm" sync v-model="model" ref="form$" :endpoint="false">
    <TextElement
      ref="filterInput"
      :label="props.label || ''"
      :placeholder="`${props.placeholder || t('form.filter-placeholder')}`"
      autocomplete="off"
      :floating="false"
      name="text"
      :disabled="props.disabled || false"
      :columns="{ label: 2, wrapper: 12 }"
    >
      <template #addon-after>
        <span class="sw-icon-cancel" @click="clear"></span>
      </template>
    </TextElement>
  </Vueform>
</template>
