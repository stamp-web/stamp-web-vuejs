<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { resolvePath } from '@/util/object-utils'
  import ImagePreview from '@/components/display/ImagePreview.vue'
  import type { PreferencePaths } from '@/models/Preference'
  import type { CellRendererParameters } from '@/components/renderers/types/cellRendererParameters'

  type CellParams = CellRendererParameters & {
    prefs?: PreferencePaths
  }

  const props = defineProps<{
    params?: CellParams
  }>()

  const hasImage = ref(false)

  const setHasImage = (value: string): void => {
    hasImage.value = value !== undefined
  }

  const image = computed(() => {
    let img = undefined
    const value = resolvePath(props.params?.data, props.params?.path) as string
    if (value) {
      const indx = value.lastIndexOf('/')
      const path = value.substring(0, indx + 1) + 'thumb-' + value.substring(indx + 1)
      img = `${props.params?.prefs?.thumbPath ?? '/'}/${path}`
      setHasImage(value)
    }
    return img
  })

  const fullSizeImage = computed(() => {
    let img = undefined
    const value = resolvePath(props.params?.data, props.params?.path) as string
    if (value) {
      img = `${props.params?.prefs?.imagePath ?? '/'}/${value}`
    }
    return img
  })
</script>
<template>
  <div :v-if="hasImage" class="items-center flex h-full">
    <image-preview
      :image-url="image"
      :show-na="true"
      :full-size-image-url="fullSizeImage"
      max-width="32"
      max-height="32"
    ></image-preview>
  </div>
</template>
<style></style>
