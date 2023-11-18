<template>
  <div
    class="info-item w-full max-w-full md:max-w-[calc(50%_-_1rem)] md:w-[calc(50%_-_1rem)] md:rounded-xl md:mx-2 border-b md:border-b-transparent md:mt-1 pt-4 pb-4 md:pt-8 pr-0 md:pb-8 pl-8 item flex items-center flex-row flex-shrink-0 flex-grow-0 hover:bg-gray-100"
  >
    <RouterLink
      :to="linkref"
      class="hover:cursor-pointer flex place-items-center place-content-center"
    >
      <i
        :to="linkref"
        class="flex place-items-center place-content-center w-12 h-12 left-6 top-[calc(50%_-_2rem)] text-[var(--vf-primary)] bg-transparent rounded-lg border border-current"
      >
        <slot name="icon"></slot>
      </i>
      <div class="flex-1 ml-4">
        <h3 class="mb-1.5 text-[var(--color-heading)] font-medium text-xl">
          <slot name="heading"></slot>
        </h3>
        <slot></slot>
      </div>
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
  import { RouterLink } from 'vue-router'
  import { computed } from 'vue'

  const props = defineProps({
    link: String
  })
  const linkref = computed(() => (props.link ? props.link : ''))
</script>
