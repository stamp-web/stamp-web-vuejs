<script lang="ts">
  import { defineComponent, type PropType } from 'vue'

  export default /*#__PURE__*/ defineComponent({
    props: {
      icon: { type: String, required: false },
      tooltip: { type: String, required: false },
      name: { type: String, required: false },
      id: { type: String, required: false },
      type: {
        type: String as PropType<'button' | 'submit' | 'reset'>,
        default: 'button',
        validator: (value: string) => ['button', 'submit', 'reset'].includes(value)
      }
    },

    computed: {
      baseClass(): string {
        return [
          'flex items-center flex-nowrap',
          'py-1 px-3',
          'hover:cursor-pointer',
          'rounded border',
          'bg-[var(--vf-bg-disabled)]',
          'text-[var(--vf-color-disabled)]',
          'border-[var(--vf-bg-disabled)]'
        ].join(' ')
      },

      appliedStyles(): string {
        return this.baseClass
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
    <slot></slot>
  </button>
</template>
