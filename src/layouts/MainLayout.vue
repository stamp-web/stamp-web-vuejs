<template>
  <AppHeader class="h-12 max-h-12" />
  <div
    class="content grid flex-col col-start-1 col-end-6 h-full w-full border-t-2 overflow-y-hidden border-[var(--vf-primary)]"
  >
    <AppNavigator
      class="app-navigator col-start-1 col-end-1 flex flex-col flex-grow-0 flex-shrink flex-auto"
    />
    <router-view v-slot="{ Component, route }">
      <transition :name="(route.meta.transition as string) || 'fade'" mode="out-in">
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>
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

  /* Slide transitions */
  .slide-left-enter-active,
  .slide-left-leave-active {
    transition: all 0.2s ease;
  }

  .slide-left-enter-from {
    transform: translateX(100%);
    opacity: 0;
  }

  .slide-left-leave-to {
    transform: translateX(-100%);
    opacity: 0;
  }

  .slide-right-enter-active,
  .slide-right-leave-active {
    transition: all 0.2s ease;
  }

  .slide-right-enter-from {
    transform: translateX(-100%);
    opacity: 0;
  }

  .slide-right-leave-to {
    transform: translateX(100%);
    opacity: 0;
  }

  /* Default fade transition */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0.5;
  }
</style>
