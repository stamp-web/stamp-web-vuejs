<script setup lang="ts">
  import { nextTick, onMounted, ref, watch } from 'vue'
  import LocaleUtils from '@/util/locale-utils'

  const props = defineProps({
    filter: String,
    label: String
  })
  const emit = defineEmits(['wantList-filter-changed'])

  const filters = ref([
    { value: 'All', name: LocaleUtils.t('wantlist-filter.All') },
    { value: 'WantList', name: LocaleUtils.t('wantlist-filter.WantList') },
    { value: 'Owned', name: LocaleUtils.t('wantlist-filter.Owned') }
  ])

  const model = ref({
    filter: filters.value[0].value
  })

  watch(
    () => [model.value.filter],
    (nv, value) => {
      if (value.find((e) => e) !== model.value.filter) {
        emit('wantList-filter-changed', model.value.filter)
      }
    }
  )

  onMounted(async () => {
    await nextTick()
    if (props.filter) {
      model.value.filter = props.filter
    }
  })
</script>

<template>
  <div class="z-999">
    <Vueform sync v-model="model" :endpoint="false" size="sm" add-class="">
      <SelectElement
        name="filter"
        :columns="{ container: 12, label: 6 }"
        :label="props.label || ''"
        :native="false"
        :items="filters"
        label-prop="name"
        value-prop="value"
        :can-clear="false"
      ></SelectElement>
    </Vueform>
  </div>
</template>
