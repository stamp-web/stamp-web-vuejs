<script lang="ts" setup>
  import { ref, nextTick, onBeforeUnmount, onMounted } from 'vue'
  import SecondaryButton from '@/components/buttons/SecondaryButton.vue'

  const $props = defineProps({
    name: String,
    label: String,
    columns: { type: Object, default: { default: 5 } }
  })
  const model = defineModel()
  const $datePicker = ref()

  const openDatePicker = () => {
    $datePicker.value.$el.querySelector('input').click()
  }

  const clearValue = () => {
    $datePicker.value.clear()
  }

  const handleClick = (evt: PointerEvent) => {
    const clz: string = (evt.target as HTMLElement).className
    if (clz.includes('sw-icon-calendar')) {
      openDatePicker()
    } else if (clz.includes('sw-icon-cancel')) {
      clearValue()
    }
  }

  onBeforeUnmount(() => {
    $datePicker?.value.$el
      ?.querySelector('.form-bg-addon')
      ?.removeEventListener('click', handleClick)
  })

  onMounted(async () => {
    await nextTick()
    $datePicker?.value.$el?.querySelector('.form-bg-addon')?.addEventListener('click', handleClick)
  })
</script>
<template>
  <DateElement
    :label="$props.label"
    :name="$props.name"
    ref="$datePicker"
    size="sm"
    v-model="model"
    :addons="{
      after: {
        template: ` <i class='sw-icon-cancel cursor-pointer text-gray-300 hover:text-current pb-0.5 px-0.5 scale-110'></i>
 <i class='cursor-pointer sw-icon-calendar text-gray-600 hover:text-black pb-0.5 pl-0.5 scale-110'></i>`
      }
    }"
    :add-Classes="{
      DatepickerWrapper: {
        calendarContainer: 'max-w-56 w-56'
      }
    }"
    :columns="$props.columns"
  ></DateElement>
</template>
