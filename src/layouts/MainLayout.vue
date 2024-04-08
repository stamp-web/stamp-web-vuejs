<template>
  <AppHeader class="h-12 max-h-12" />
  <div
    class="content grid flex-col col-start-1 col-end-6 h-full w-full border-t-2 overflow-y-hidden border-[var(--vf-primary)]"
  >
    <AppNavigator
      class="app-navigator col-start-1 col-end-1 flex flex-col flex-grow-0 flex-shrink flex-auto"
    />
    <router-view />
  </div>
</template>

<script lang="ts">
  import AppHeader from '@/components/navigation/AppHeader.vue'
  import AppNavigator from '@/components/navigation/AppNavigator.vue'

  export default {
    components: { AppHeader, AppNavigator }
  }
</script>

<style scoped lang="scss">
  .content {
    grid-template: auto / auto 1fr auto;
  }
</style>
