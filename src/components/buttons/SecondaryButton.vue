<script lang="ts">
import { defineComponent } from 'vue'
import BaseButton from '@/components/buttons/BaseButton.vue'

const styleColors: string =
  'enabled:border-[var(--vf-border-color-btn-secondary)] ' +
  'enabled:bg-[var(--vf-bg-btn-secondary)] enabled:text-[var(--vf-color-input)] ' +
  'hover:enabled:bg-[var(--vf-bg-passive)] hover:enabled:border-[var(--vf-bg-btn-secondary)]'

export default /*#__PURE__*/ defineComponent({
  extends: BaseButton,
  name: 'SecondaryButton',

  computed: {
    appliedStyles() {
      return this.baseClass + styleColors
    }
  },
  setup(props, ctx) {
    return {
      // @ts-ignore
      ...BaseButton.setup(props, ctx)
    }
  }
})
</script>
<template>
  <button :class="`${appliedStyles}`">
    <span v-if="icon" :class="`${icon}`"></span>
    <slot></slot>
  </button>
</template>
