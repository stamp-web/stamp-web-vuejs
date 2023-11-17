<script setup lang="ts">
  import AppNavButton from '@/components/navigation/AppNavButton.vue'
</script>
<template>
  <nav class="align-middle bg-gray-900 flex flex-row min-w-fit md:w-[120px] p-2">
    <AppNavButton title="Home" link="/"></AppNavButton>
    <AppNavButton title="Stamp Collections" link="/stampCollections"></AppNavButton>
    <AppNavButton title="Albums" link="/albums"></AppNavButton>
    <AppNavButton title="Countries" link="/countries"></AppNavButton>
    <AppNavButton title="Sellers" link="/sellers"></AppNavButton>
    <AppNavButton title="Catalogues" link="/catalogues"></AppNavButton>
    <AppNavButton title="Stamps" link="/stamps"></AppNavButton>
    <AppNavButton title="About" link="/about" class="mt-auto"></AppNavButton>
    <AppNavButton title="Settings" link="/settings"></AppNavButton>
  </nav>
</template>
