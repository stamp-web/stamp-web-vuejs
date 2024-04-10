<script setup lang="ts">
  import { onBeforeMount, ref, watch } from 'vue'
  import _debounce from 'lodash-es/debounce'

  const props = defineProps({
    pageSize: Number
  })
  const emit = defineEmits(['page-size-changed'])

  const pageSizes = ref([100, 250, 500, 1000, 2500, 5000])
  const model = ref({
    pageSize: 500
  })

  const pageSizeChanged = _debounce(() => {
    if (model.value.pageSize > 0) {
      emit('page-size-changed', model.value.pageSize)
    }
  })

  watch(
    () => [model.value.pageSize],
    () => {
      pageSizeChanged()
    }
  )

  onBeforeMount(() => {
    if (props.pageSize) {
      model.value.pageSize = props.pageSize
    }
  })
</script>

<template>
  <div class="scale-90 z-999">
    <Vueform sync v-model="model" :endpoint="false" size="sm">
      <SelectElement
        name="pageSize"
        :native="false"
        :items="pageSizes"
        class="w-[80px]"
        :can-clear="false"
      ></SelectElement>
    </Vueform>
  </div>
</template>
