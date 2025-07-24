<script lang="ts">
  import { defineComponent } from 'vue'
  import BaseButton from '@/components/buttons/BaseButton.vue'

  const styleColors = [
    'enabled:bg-[var(--vf-primary)]',
    'enabled:text-[var(--vf-color-on-primary)]',
    'hover:enabled:bg-[var(--vf-primary-darker)]'
  ].join(' ')

  export default /*#__PURE__*/ defineComponent({
    extends: BaseButton,
    name: 'PrimaryButton',

    computed: {
      appliedStyles() {
        return `${this.baseClass} ${styleColors}`
      },
      ariaLabel(): string | undefined {
        return this.tooltip || undefined
      }
    },
    setup() {
      return {}
    }
  })
</script>
<template>
  <button
    :class="appliedStyles"
    v-tooltip="tooltip"
    :name="name"
    :id="id"
    :aria-label="ariaLabel"
    :type="type"
  >
    <span v-if="icon" :class="icon"></span>
    <span class="truncate"><slot></slot></span>
  </button>
</template>
