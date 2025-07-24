<script lang="ts">
  import { defineComponent } from 'vue'
  import BaseButton from '@/components/buttons/BaseButton.vue'

  const styleColors = [
    'enabled:border-[var(--vf-border-color-btn-secondary)]',
    'enabled:bg-[var(--vf-bg-btn-secondary)]',
    'enabled:text-[var(--vf-color-input)]',
    'hover:enabled:bg-[var(--vf-bg-passive)]',
    'hover:enabled:border-[var(--vf-bg-btn-secondary)]'
  ].join(' ')

  export default /*#__PURE__*/ defineComponent({
    extends: BaseButton,
    name: 'SecondaryButton',

    computed: {
      appliedStyles(): string {
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
