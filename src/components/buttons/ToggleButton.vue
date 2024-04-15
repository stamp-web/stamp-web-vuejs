<script lang="ts" setup>
  import { computed } from 'vue'
  import { ButtonGroupModel } from '@/components/buttons/ButtonGroupModel'

  const $props = defineProps({
    model: ButtonGroupModel,
    group: String
  })

  const $emit = defineEmits(['toggle-changed'])

  const toggledClasses = computed(() => {
    return $props.model?.isToggled ? ' bg-gray-300 ' : ''
  })

  const baseClasses =
    'px-1 bg-gray-100 hover:bg-gray-200 ' +
    'border-gray-400 border border-r-0 last:border-r ' +
    'first:rounded-tl-md first:rounded-bl-md last:rounded-tr-md last:rounded-br-md '

  const onToggle = () => {
    if (($props.group && !$props.model?.isToggled) || !$props.group) {
      $emit('toggle-changed', $props.model)
    }
  }
</script>
<template>
  <button
    v-tooltip="$props.model?.tooltip"
    :class="`${toggledClasses} ${baseClasses}`"
    @click="onToggle"
  >
    <span v-if="$props.model?.icon" :class="`${$props.model.icon}`"></span>
    <span class="truncate">{{ $props.model?.label }}</span>
  </button>
</template>
