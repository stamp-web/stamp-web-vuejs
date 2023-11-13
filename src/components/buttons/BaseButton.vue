<script lang="ts">
import { defineComponent } from 'vue'

export default /*#__PURE__*/ defineComponent({
  props: {
    icon: String
  },

  computed: {
    appliedStyles() {
      return this.baseClass
    }
  },
  setup() {
    const baseClass =
      'py-1 px-3 hover:cursor-pointer ' +
      'bg-[var(--vf-bg-disabled)] text-[var(--vf-color-disabled)] ' +
      'rounded border border-[var(--vf-bg-disabled)] '

    return {
      baseClass
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
