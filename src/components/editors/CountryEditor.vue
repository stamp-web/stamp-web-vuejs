<script lang="ts" setup>
  import { ref, onMounted, nextTick, computed, isReactive, toRaw, watch } from 'vue'
  import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
  import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
  import localeUtil from '@/util/locale-utils'
  import type { Country } from '@/models/entityModels'

  const props = defineProps<{ model: Country }>()

  defineEmits(['cancel', 'save'])

  const modelValue = ref<Country>()
  const form$ = ref()

  const title = computed(() => {
    return localeUtil.t(
      props.model && props.model.id >= 0 ? 'titles.edit-country' : 'titles.new-country'
    )
  })
  const invalid = computed(() => {
    return form$.value && form$.value.invalid
  })

  async function buildViewModel() {
    modelValue.value = structuredClone(isReactive(props.model) ? toRaw(props.model) : props.model)
  }

  watch(
    () => [props.model],
    async () => {
      await buildViewModel()
    }
  )

  onMounted(async () => {
    await buildViewModel()
    await nextTick()
    if (form$.value.el$) {
      form$.value.el$('name').focus()
      form$.value.validate()
    }
  })
</script>

<template>
  <div class="panel-form bg-white" role="form">
    <div class="panel-form-title"><span class="sw-icon-country"></span>{{ title }}</div>
    <Vueform
      size="sm"
      ref="form$"
      :model-value="modelValue"
      sync
      class="panel-form-form"
      :endpoint="false"
    >
      <TextElement
        :label="localeUtil.t('form.name')"
        name="name"
        input-type="search"
        autocomplete="off"
        rules="required|max:150"
      />
      <TextareaElement
        :label="localeUtil.t('form.description')"
        name="description"
        rules="max:1500"
        :autogrow="false"
      />
    </Vueform>
    <div class="panel-form-buttonbar">
      <PrimaryButton class="mr-2" :disabled="invalid" @click="$emit('save', modelValue)">{{
        localeUtil.t('actions.save')
      }}</PrimaryButton>
      <SecondaryButton @click="$emit('cancel')">{{
        localeUtil.t('actions.cancel')
      }}</SecondaryButton>
    </div>
  </div>
</template>
