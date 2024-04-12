<script setup lang="ts">
  import { onBeforeMount, ref, watch } from 'vue'

  const props = defineProps({
    pageSize: Number,
    label: String
  })
  const emit = defineEmits(['page-size-changed'])

  const pageSizes = ref([100, 250, 500, 1000, 2500, 5000])
  const model = ref({
    pageSize: 500
  })

  watch(
    () => [model.value.pageSize],
    (nv, value) => {
      if (value.find((e) => e) !== model.value.pageSize) {
        emit('page-size-changed', model.value.pageSize)
      }
    }
  )

  onBeforeMount(() => {
    if (props.pageSize) {
      model.value.pageSize = props.pageSize
    }
  })
</script>

<template>
  <div class="z-999">
    <Vueform sync v-model="model" :endpoint="false" size="sm" add-class="">
      <SelectElement
        name="pageSize"
        :columns="{ container: 12, label: 6 }"
        :label="props.label || ''"
        :native="false"
        :items="pageSizes"
        :can-clear="false"
      ></SelectElement>
    </Vueform>
  </div>
</template>
