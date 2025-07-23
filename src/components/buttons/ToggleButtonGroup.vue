<script lang="ts" setup>
  import ToggleButton from '@/components/buttons/ToggleButton.vue'
  import { onMounted, ref } from 'vue'
  import type { ButtonGroupModel } from '@/components/buttons/ButtonGroupModel'

  const $props = defineProps({
    models: Array<ButtonGroupModel>
  })

  const buttonModels = ref([] as ButtonGroupModel[])

  const $emit = defineEmits(['toggle-changed'])

  const toggled = async (model: ButtonGroupModel) => {
    buttonModels.value.forEach((m) => {
      m.isToggled = m.value === model.value
    })
    $emit('toggle-changed', model.value)
  }

  onMounted(() => {
    if ($props.models) {
      $props.models.forEach((model) => {
        buttonModels.value.push(model)
      })
    }
  })
</script>
<template>
  <div>
    <toggle-button
      v-for="model in buttonModels"
      :key="model.value"
      :model="model"
      group="btn-group"
      @toggle-changed="toggled"
    ></toggle-button>
  </div>
</template>
