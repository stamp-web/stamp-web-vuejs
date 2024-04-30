<script lang="ts" setup>
  import { ref } from 'vue'

  const $props = defineProps({
    name: String,
    label: String,
    columns: {
      type: Object,
      default: () => {
        return { default: 10 }
      }
    }
  })
  const model = defineModel()
  const $datePicker = ref()

  const openDatePicker = () => {
    $datePicker.value.$el.querySelector('input').click()
  }

  const clearValue = () => {
    $datePicker.value.clear()
  }
</script>
<template>
  <DatesElement
    :label="$props.label || ''"
    :name="$props.name || ''"
    mode="range"
    ref="$datePicker"
    size="sm"
    v-model="model"
    :add-Classes="{
      DatepickerWrapper: {
        calendarContainer: 'max-w-56 w-56'
      }
    }"
    :columns="$props.columns || ''"
    ><template #addon-after="">
      <i
        @click="clearValue"
        class="sw-icon-cancel cursor-pointer text-gray-300 hover:text-current pb-0.5 px-0.5 scale-110"
      ></i>
      <i
        @click="openDatePicker"
        class="cursor-pointer sw-icon-calendar text-gray-600 hover:text-black pb-0.5 pl-0.5 scale-110"
      ></i> </template
  ></DatesElement>
</template>
