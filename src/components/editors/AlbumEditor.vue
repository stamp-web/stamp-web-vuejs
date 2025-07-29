<script lang="ts" setup>
  import { ref, onMounted, nextTick, computed, watch, isReactive, toRaw } from 'vue'
  import type { Album } from '@/models/entityModels'
  import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
  import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
  import localeUtil from '@/util/locale-utils'
  import StampCollectionSelector from '@/components/inputs/StampCollectionSelector.vue'
  import { preferenceStore } from '@/stores/preferenceStore'

  const prefStore = preferenceStore()

  const props = defineProps<{ model: Album }>()

  const modelValue = ref<Album>()
  const form$ = ref()

  defineEmits(['cancel', 'save'])

  async function buildViewModel() {
    modelValue.value = structuredClone(isReactive(props.model) ? toRaw(props.model) : props.model)
    if (!props.model.id || props.model.id < 1) {
      const v = await prefStore.findByNameAndCategory('stampCollectionRef', 'stamps')
      if (v) {
        modelValue.value.stampCollectionRef = v.value ? Number.parseInt(v.value) : -1
      }
    }
  }

  watch(
    () => [props.model],
    async () => {
      await buildViewModel()
    }
  )

  const title = computed(() => {
    return localeUtil.t(
      modelValue.value && modelValue.value.id >= 0 ? 'titles.edit-album' : 'titles.new-album'
    )
  })
  const invalid = computed(() => {
    return form$.value && form$.value.invalid
  })

  onMounted(async () => {
    await buildViewModel()
    await nextTick()
    if (form$.value.el$) {
      form$.value.el$('name').focus()
      form$.value.validate()
    }
  })

  defineExpose({ title })
</script>

<template>
  <div class="panel-form bg-white" role="form">
    <div class="panel-form-title"><span class="sw-icon-album"></span>{{ title }}</div>
    <Vueform
      size="sm"
      ref="form$"
      :model-value="modelValue"
      class="panel-form-form"
      sync
      :endpoint="false"
    >
      <StampCollectionSelector
        name="stampCollectionRef"
        :label="localeUtil.t('form.stampCollection')"
        rules="required"
      ></StampCollectionSelector>
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
