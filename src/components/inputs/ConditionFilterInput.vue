<script setup lang="ts">
  import { nextTick, onMounted, ref, watch } from 'vue'
  import LocaleUtils from '@/util/locale-utils'

  const props = defineProps({
    condition: String,
    label: String
  })
  const emit = defineEmits(['condition-filter-changed'])

  const conditions = ref([
    { value: 'All', name: LocaleUtils.t('condition-filter.All') },
    { value: 'Used', name: LocaleUtils.t('condition-filter.Used') },
    { value: 'Mint', name: LocaleUtils.t('condition-filter.Mint') },
    { value: 'Postal', name: LocaleUtils.t('condition-filter.Postal') }
  ])

  const model = ref({
    condition: conditions.value[0].value
  })

  watch(
    () => [model.value.condition],
    (nv, value) => {
      if (value.find((e) => e) !== model.value.condition) {
        emit('condition-filter-changed', model.value.condition)
      }
    }
  )

  onMounted(async () => {
    await nextTick()
    if (props.condition) {
      model.value.condition = props.condition
    }
  })
</script>

<template>
  <div class="z-999">
    <Vueform sync v-model="model" :endpoint="false" size="sm" add-class="">
      <SelectElement
        name="condition"
        :columns="{ container: 12, label: 6 }"
        :label="props.label || ''"
        :native="false"
        :items="conditions"
        label-prop="name"
        value-prop="value"
        :can-clear="false"
      ></SelectElement>
    </Vueform>
  </div>
</template>
