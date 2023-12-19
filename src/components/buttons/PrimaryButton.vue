<script lang="ts">
  import { defineComponent } from 'vue'
  import BaseButton from '@/components/buttons/BaseButton.vue'

  export const styleColors: string =
    'enabled:bg-[var(--vf-primary)] enabled:text-[var(--vf-color-on-primary)] ' +
    'hover:enabled:bg-[var(--vf-primary-darker)]'

  export default /*#__PURE__*/ defineComponent({
    extends: BaseButton,
    name: 'PrimaryButton',

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
  <button :class="`${appliedStyles}`" v-tooltip="$props.tooltip">
    <span v-if="icon" :class="`${icon}`"></span>
    <span class="truncate"><slot></slot></span>
  </button>
</template>
