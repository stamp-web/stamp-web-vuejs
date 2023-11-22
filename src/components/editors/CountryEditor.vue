<script lang="ts">
  import { ref, onMounted, nextTick } from 'vue'
  import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
  import SecondaryButton from '@/components/buttons/SecondaryButton.vue'

  export default {
    name: 'CountryEditor',
    components: {
      SecondaryButton,
      PrimaryButton
    },
    props: ['model'],
    emits: ['cancel', 'save'],
    computed: {
      title: (props: any) => {
        return props.model && props.model.id >= 0 ? 'Edit Country' : 'New Country'
      },
      invalid: (props: any) => {
        return props && props.form$ && props.form$.invalid
      }
    },
    setup(/*props*/) {
      const form$ = ref(null)

      onMounted(async () => {
        await nextTick()
        // @ts-ignore
        form$.value.el$('name').focus()
        // @ts-ignore
        form$.value.validate()
      })
      return { form$ }
    }
  }
</script>

<template>
  <div class="panel-form bg-white" role="form">
    <div class="panel-form-title"><span class="sw-icon-country"></span>{{ title }}</div>
    <Vueform
      size="sm"
      ref="form$"
      :model-value="model"
      sync
      class="panel-form-form"
      :endpoint="false"
    >
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
