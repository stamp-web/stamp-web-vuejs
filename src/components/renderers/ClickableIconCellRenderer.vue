<script lang="ts">
export default {
  name: 'ClickableIconCellRenderer',
  props: ['params', 'icon'],
  emits: ['icon-cell-clicked'],
  setup(props) {
    return {
      props
    }
  },
  methods: {
    handleClick() {
      const parent = this.params.context.component
      const callback = this.params.onClick
      if (parent[callback]) {
        parent[callback].call(this, this.params.node.rowIndex)
      }
    }
  }
}
</script>

<template>
  <span :class="`${params.icon || icon}`" @click="handleClick()"></span>
</template>
