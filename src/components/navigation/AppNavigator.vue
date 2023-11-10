<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
<template>
  <nav class="align-middle bg-gray-900 flex flex-row min-w-fit w-[120px] p-2">
    <RouterLink
      :exact-active-class="'bg-gray-600 text-gray-50'"
      class="text-gray-100 mb-1 p-2 align-middle text-center w-full rounded hover:bg-gray-700"
      to="/"
      >Home</RouterLink
    >
    <RouterLink
      :exact-active-class="'bg-gray-600 text-gray-50'"
      class="text-gray-100 mb-1 mt-1 p-2 align-middle text-center w-full rounded hover:bg-gray-700"
      disabled=""
      to="/about"
      >About</RouterLink
    >
    <RouterLink
      :exact-active-class="'bg-gray-600 text-gray-50'"
      class="text-gray-100 mb-1 mt-1 p-2 align-middle text-center w-full rounded hover:bg-gray-700"
      to="/stampCollections"
      >Stamp Collections</RouterLink
    >
    <RouterLink
      :exact-active-class="'bg-gray-600 text-gray-50'"
      class="text-gray-100 mb-1 mt-1 p-2 align-middle text-center w-full rounded hover:bg-gray-700"
      to="/albums"
      >Albums</RouterLink
    >
    <RouterLink
      :exact-active-class="'bg-gray-600 text-gray-50'"
      class="text-gray-100 mt-1 p-2 align-middle text-center w-full rounded hover:bg-gray-700"
      to="/countries"
      >Countries</RouterLink
    >
  </nav>
</template>
