<script setup lang="ts">
  import loadImage, { type LoadImageOptions } from 'blueimp-load-image'
  import { onMounted, ref, watch } from 'vue'
  import _isEmpty from 'lodash-es/isEmpty'
  import { bus } from 'vue3-eventbus'

  type imageOptions = loadImage.LoadImageOptions & {}

  const props = defineProps({
    showNa: Boolean,
    imageUrl: String,
    fullSizeImageUrl: String,
    containerSelector: String,
    maxWidth: String,
    maxHeight: String
  })

  const showingFullImage = ref(false)
  const fullImage = ref()
  const imgBlock = ref()
  const hasValidImage = ref(false)

  watch(
    () => [props.imageUrl],
    () => {
      processImage()
    },
    { deep: true }
  )

  const loadImageByPath = (path: string, options: imageOptions) => {
    return loadImage(path, options).then((data: loadImage.LoadImageResult) => {
      if (data.image && imgBlock.value) {
        imgBlock.value.appendChild(data.image)
      }
    })
  }

  const getOptions = (): imageOptions => {
    const options = {} as LoadImageOptions
    if (props.maxWidth) {
      options.maxWidth = parseInt(props.maxWidth)
    }
    if (props.maxHeight) {
      options.maxHeight = parseInt(props.maxHeight)
    }
    options.canvas = true
    return options
  }
  const processImage = () => {
    if (props.imageUrl) {
      if (!_isEmpty(props.imageUrl)) {
        hasValidImage.value = true
        const options = getOptions()
        loadImageByPath(props.imageUrl, options).catch(() => {
          hasValidImage.value = false
          if (props.showNa) {
            const noPath = new URL('../../assets/images/not-available-plus.jpg', import.meta.url)
              .href
            loadImageByPath(noPath, options).catch(() => {
              // do nothing and swallow error
            })
          }
        })
      }
    }
  }

  /**
   * Attempts to setup the options for the full size image by setting the maximum width and height
   * to the containers dimensions at 95%.
   */
  const getFullImageOptions = (): object => {
    const options = {} as LoadImageOptions
    const nodes: NodeList = document.querySelectorAll(props.containerSelector ?? 'body')
    if (nodes.length > 0) {
      const node = nodes.item(0) as Element
      options.maxWidth = Math.floor(node.clientWidth * 0.95)
      options.maxHeight = Math.floor(node.clientHeight * 0.95)
    }
    return options
  }

  const closeFullImage = () => {
    while (fullImage.value?.firstChild) {
      fullImage.value.removeChild(fullImage.value.firstChild)
    }
    showingFullImage.value = false
    bus.off('showingImage', handleShowEvent)
  }

  const handleShowEvent = () => {
    if (showingFullImage.value) {
      closeFullImage()
    }
  }

  const showFullImage = () => {
    if (showingFullImage.value || (!hasValidImage.value && !props.showNa)) {
      return
    }
    bus.emit('showingImage', fullImage.value)
    bus.on('showingImage', handleShowEvent)
    const imageUrl = props.fullSizeImageUrl ? props.fullSizeImageUrl : props.imageUrl
    if (imageUrl) {
      loadImage(imageUrl, getFullImageOptions()).then((data: loadImage.LoadImageResult) => {
        showingFullImage.value = true
        if (data.image) {
          fullImage.value.appendChild(data.image)
        }
      })
    }
  }

  onMounted(() => {
    processImage()
  })
</script>
<template>
  <div ref="imgBlock" @click.stop="showFullImage" class="m-auto bg-transparent"></div>
  <teleport :to="props.containerSelector ?? 'body'" :disabled="!showingFullImage">
    <div
      class="fullImage shadow-lg shadow-slate-600 fixed top-[50%] left-[50%] -translate-y-[50%] -translate-x-[50%] z-999"
      ref="fullImage"
      @click="closeFullImage"
    ></div>
  </teleport>
</template>
<style></style>
