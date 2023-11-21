<script lang="ts" setup>
  import { ref, onMounted, nextTick, computed, onBeforeMount } from 'vue'
  import type { Album, StampCollection } from '@/models/entityModels'
  import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
  import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
  import { stampCollectionStore } from '@/stores/stampCollectionStore'

  const props = defineProps({
    // @ts-ignore
    model: {} as Album
  })
  defineEmits(['cancel', 'save'])

  const form$ = ref()
  const store = stampCollectionStore()
  const stampCollections = ref(new Array<StampCollection>())

  const title = computed(() => {
    return props.model && props.model.id >= 0 ? 'Edit Album' : 'New Album'
  })
  const invalid = computed(() => {
    return form$.value && form$.value.invalid
  })

  defineExpose({ title })

  onBeforeMount(async () => {
    stampCollections.value = await store.find()
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
      <SelectElement
        name="stampCollectionRef"
        :native="false"
        :items="stampCollections"
        label-prop="name"
        value-prop="id"
        rules="required"
      ></SelectElement>
      <TextElement
        label="Name"
        name="name"
        autocomplete="none"
        rules="required|max:150"
      />
      <TextareaElement
        label="Description"
        name="description"
        rules="max:1500"
        :autogrow="false"
      />
    </Vueform>
    <div class="panel-form-buttonbar">
      <PrimaryButton class="mr-2" :disabled="invalid" @click="$emit('save', model)"
        >Save</PrimaryButton
      >
      <SecondaryButton @click="$emit('cancel')">Cancel</SecondaryButton>
    </div>
  </div>
</template>
