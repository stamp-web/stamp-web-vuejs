<script lang="ts">
  import { ref, onMounted, onUpdated, nextTick } from 'vue'
  import type { ComponentObjectPropsOptions } from 'vue'
  import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
  import SecondaryButton from '@/components/buttons/SecondaryButton.vue'

  export default {
    name: 'StampCollectionEditor',
    components: {
      SecondaryButton,
      PrimaryButton
    },
    props: ['model'],
    emits: ['cancel', 'save'],
    computed: {
      // @ts-ignore
      title: (props) => {
        // @ts-ignore
        return props.model && props.model.id >= 0
          ? 'Edit Stamp Collection'
          : 'New Stamp Collection'
      },
      // @ts-ignore
      invalid: (props: ComponentObjectPropsOptions) => {
        // @ts-ignore
        return props && props.form$ && props.form$.invalid
      }
    },
    setup(/*props*/) {
      const form$ = ref(null)
      const updateForm = () => {
        /* if (!_.isEmpty(props.model)) {
        const name = form$.value.el$('name')
        const description = form$.value.el$('description')

        name.update(props.model.name)
        description.update(props.model.description)
      }*/
      }

      onMounted(async () => {
        updateForm()
        await nextTick()

        // @ts-ignore
        form$.value.el$('name').focus()
        // @ts-ignore
        form$.value.validate()
      })
      onUpdated(() => {
        updateForm()
      })
      return { form$ }
    }
  }
</script>

<template>
  <div class="panel-form bg-white">
    <div class="panel-form-title">
      <span class="sw-icon-stamp-collection"></span>{{ title }}
    </div>
    <Vueform size="sm" ref="form$" :model-value="model" sync class="panel-form-form">
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
