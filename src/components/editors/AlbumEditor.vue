<script lang="ts" setup>
  import { ref, onMounted, nextTick, computed, watch } from 'vue'
  import type { Album } from '@/models/entityModels'
  import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
  import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
  import localeUtil from '@/util/locale-utils'
  import StampCollectionSelector from '@/components/inputs/StampCollectionSelector.vue'
  import { preferenceStore } from '@/stores/PreferenceStore'

  const prefStore = preferenceStore()

  const props = defineProps<{ model: Album }>()

  const model$ = ref()
  const form$ = ref()

  defineEmits(['cancel', 'save'])

  watch(
    () => [props.model],
    async () => {
      modelValue.value = props.model
      if (!props.model.id || props.model.id < 1) {
        const v = await prefStore.findByNameAndCategory('stampCollectionRef', 'stamps')
        if (v) {
          modelValue.value.stampCollectionRef = v.value ? Number.parseInt(v.value) : -1
        }
      }
    },
    {
      deep: true
    }
  )

  const modelValue = computed({
    get: () => {
      return model$.value
    },
    set: (value: Album) => {
      model$.value = value
    }
  })

  const title = computed(() => {
    return localeUtil.t(
      modelValue.value && modelValue.value.id >= 0 ? 'titles.edit-album' : 'titles.new-album'
    )
  })
  const invalid = computed(() => {
    return form$.value && form$.value.invalid
  })

  defineExpose({ title })

  onMounted(async () => {
    await nextTick()
    if (form$.value.el$) {
      form$.value.el$('name').focus()
      form$.value.validate()
    }
  })
</script>

<template>
  <div class="panel-form bg-white" role="form">
    <div class="panel-form-title"><span class="sw-icon-album"></span>{{ title }}</div>
    <Vueform
      size="sm"
      ref="form$"
      :model-value="model"
      sync
      class="panel-form-form"
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
      <PrimaryButton class="mr-2" :disabled="invalid" @click="$emit('save', model)">{{
        localeUtil.t('actions.save')
      }}</PrimaryButton>
      <SecondaryButton @click="$emit('cancel')">{{
        localeUtil.t('actions.cancel')
      }}</SecondaryButton>
    </div>
  </div>
</template>
