<script lang="ts" setup>
  import { ref, onMounted, nextTick, computed } from 'vue'
  import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
  import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
  import localeUtil from '@/util/locale-utils'
  import type { Catalogue } from '@/models/Catalogue'
  import CurrencySelector from '@/components/inputs/CurrencySelector.vue'
  import CatalogueTypeSelector from '@/components/inputs/CatalogueTypeSelector.vue'

  const props = defineProps<{ model: Catalogue }>()

  defineEmits(['cancel', 'save'])

  const form$ = ref()

  const title = computed(() => {
    return localeUtil.t(
      props.model && props.model.id > 0 ? 'titles.edit-catalogue' : 'titles.new-catalogue'
    )
  })
  const invalid = computed(() => {
    return form$.value && form$.value.invalid
  })

  onMounted(async () => {
    await nextTick()
    if (form$.value.el$) {
      form$.value.el$('name').focus()
      form$.value.validate()
    }
  })
</script>

<template>
  <div class="panel-form bg-white catalogue-editor" role="form">
    <div class="panel-form-title"><span class="sw-icon-catalogue"></span>{{ title }}</div>
    <Vueform
      size="sm"
      ref="form$"
      :model-value="model"
      sync
      :display-errors="false"
      class="panel-form-form"
      :endpoint="false"
    >
      <HiddenElement :meta="true" name="id" />
      <TextElement
        :label="localeUtil.t('form.issue')"
        name="issue"
        autocomplete="off"
        :columns="{ container: 12, label: 12, wrapper: 3 }"
        rules="required|regex:/^\d\d\d\d$/"
      />
      <CatalogueTypeSelector
        :label="localeUtil.t('form.catalogueType')"
        name="type"
        rules="required"
      ></CatalogueTypeSelector>
      <TextElement
        :label="localeUtil.t('form.name')"
        name="name"
        input-type="search"
        autocomplete="off"
        rules="required|max:150"
      />
      <CurrencySelector
        :label="localeUtil.t('form.currency')"
        name="code"
        rules="required"
        :columns="{ container: 12, label: 12, wrapper: 4 }"
      ></CurrencySelector>
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

<style>
  .catalogue-editor .form-text-sm {
    font-size: 12px;
  }
</style>
