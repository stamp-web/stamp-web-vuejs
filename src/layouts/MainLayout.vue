<template>
  <AppHeader />
  <div class="content grid flex-col col-start-1 col-end-6 h-full w-full">
    <AppNavigator
      class="app-navigator col-start-1 col-end-1 flex flex-col flex-grow-0 flex-shrink flex-auto"
    />
    <router-view/>
  </div>
</template>

<script lang="ts">
import '../../node_modules/ag-grid-community/styles/ag-grid.css'
import '../../node_modules/ag-grid-community/styles/ag-theme-alpine.css'

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
