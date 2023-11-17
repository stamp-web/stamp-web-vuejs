<template>
  <AppHeader class="h-12 max-h-12" />
  <router-view />
</template>

<script lang="ts">
  import AppHeader from '@/components/navigation/AppHeader.vue'

  export default {
    components: { AppHeader }
  }
</script>
