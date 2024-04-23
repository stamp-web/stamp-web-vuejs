<script lang="ts">
  import { defineComponent } from 'vue'

  export default /*#__PURE__*/ defineComponent({
    props: {
      icon: String,
      tooltip: String,
      name: String,
      id: String
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
        'rounded border border-[var(--vf-bg-disabled)] ' +
        'flex-nowrap item-center flex flex-row '

      return {
        baseClass
      }
    }
  })
</script>

<template>
  <button
    :class="`${appliedStyles}`"
    v-tooltip="$props.tooltip"
    :name="$props.name"
    :id="$props.id"
  >
    <span v-if="icon" :class="`${icon}`"></span>
    <slot></slot>
  </button>
</template>
