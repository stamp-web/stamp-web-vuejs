<script setup lang="ts">
  import ImagePreview from '@/components/display/ImagePreview.vue'
  import { watch, computed, onMounted, onUnmounted, ref } from 'vue'
  import { resolvePath } from '@/util/object-utils'
  import CountryCellRenderer from '@/components/renderers/CountryCellRenderer.vue'
  import StampDescriptionCellRenderer from '@/components/renderers/StampDescriptionCellRenderer.vue'
  import NotesCellRenderer from '@/components/renderers/NotesCellRenderer.vue'
  import CertCellRenderer from '@/components/renderers/CertCellRenderer.vue'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const props = defineProps({
    stamp: Object as any,
    path: String,
    prefPaths: {} as any,
    isSelected: Boolean
  })

  const status = ref({
    selected: false
  })
  const imageFrame = ref()
  const imageVisible = ref(false)

  const emit = defineEmits(['selected', 'deselected'])

  watch(
    () => [[props.isSelected]],
    () => {
      status.value.selected = props.isSelected
    }
  )

  const toggleSelection = (event: MouseEvent) => {
    status.value.selected = !status.value.selected
    emit(status.value.selected ? 'selected' : 'deselected', props.stamp, {
      shiftKey: event?.shiftKey ?? false
    })
  }

  const imageUrl = computed(() => {
    let img = undefined
    const value = resolvePath(props.stamp, props.path ?? '') as string
    if (value) {
      const indx = value.lastIndexOf('/')
      const path = value.substring(0, indx + 1) + 'thumb-' + value.substring(indx + 1)
      img = `${props.prefPaths?.thumbPath ?? ''}/${path}`
    }
    return img
  })

  const fullSizeImage = computed(() => {
    let img = undefined
    const value = resolvePath(props.stamp, props.path ?? '') as String
    if (value) {
      img = `${props.prefPaths?.imagePath ?? ''}/${value}`
    }
    return img
  })

  onUnmounted(() => {
    observer.disconnect()
  })

  onMounted(async () => {
    status.value.selected = props.isSelected
    if (imageFrame.value) {
      observer.observe(imageFrame.value)
    }
  })

  const observer = new IntersectionObserver(
    function (entries) {
      if (entries[0].isIntersecting === true) {
        imageVisible.value = true
      }
    },
    { threshold: [0] }
  )
</script>
<template>
  <div
    @click="toggleSelection($event)"
    class="flex flex-col bg-gray-200 select-none"
    ref="imageFrame"
  >
    <div
      class="m-2 h-[145px] w-[172px] p-1 bg-gray-900 flex justify-center align-middle"
      v-if="!props.stamp?.wantList && imageVisible"
    >
      <image-preview
        :showNa="true"
        :max-height="'125'"
        :max-width="'160'"
        :image-url="imageUrl"
        :full-size-image-url="fullSizeImage"
      ></image-preview>
    </div>
    <div
      class="h-[150px] w-full align-middle text-center leading-[150px] inline-block italic text-[0.75rem]"
      v-if="props.stamp?.wantList === true"
    >
      {{ t('display.wantlist-item') }}
    </div>

    <div class="flex text-[0.65rem] m-2 mt-0.5 mb-0">
      <span class="truncate leading-3 align-middle inline-block h-[1rem]">
        {{ props.stamp?.activeCatalogueNumber?.number }}&nbsp;
        <country-cell-renderer
          :countryRef="props.stamp?.countryRef"
          embedded="true"
        ></country-cell-renderer>
      </span>

      <notes-cell-renderer
        :stamp="props.stamp"
        path="stampOwnerships[0]"
        class="ml-auto w-4 h-4"
      ></notes-cell-renderer>
      <cert-cell-renderer
        v-if="props.stamp?.stampOwnerships[0]?.cert"
        :stamp="props.stamp"
        path="stampOwnerships[0]"
        class="w-4 h-4"
      ></cert-cell-renderer>
    </div>
    <div class="truncate text-[0.65rem] leading-3 m-2 mt-0 mb-1">
      <stamp-description-cell-renderer :stamp="props.stamp"></stamp-description-cell-renderer>
    </div>
  </div>
</template>
