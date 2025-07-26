<script setup lang="ts">
  import { ref, onMounted } from 'vue'

  import { Prompt } from '@/components/Prompt'
  import { TransitionRoot } from '@headlessui/vue'
  import SellerEditor from '@/components/editors/SellerEditor.vue'
  import DataGridComponent from '@/components/table/DataGridComponent.vue'
  import type { Seller } from '@/models/entityModels'
  import { sellerStore } from '@/stores/sellerStore'
  import { createInstance } from '@/models/entityModels'
  import { ColumnDefinition } from '@/components/table/DataGridModels'
  import PrimaryButton from '@/components/buttons/PrimaryButton.vue'
  import SecondaryButton from '@/components/buttons/SecondaryButton.vue'
  import FilterInput from '@/components/inputs/FilterInput.vue'
  import { Operators, Predicate } from 'odata-filter-parser'
  import { useRouter } from 'vue-router'

  import filterableCollection from '@/components/behaviors/filterableCollection'
  import editableModel from '@/components/behaviors/editableModel'
  import stampCount from '@/components/renderers/formatters/StampCountValueFormatter'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
  const router = useRouter()

  const { setCollection, setFilterString, filteredList, filterString, selected, setSelected } =
    filterableCollection<Seller>('seller-filter')

  const { isEditorShown, setEditModel, getEditModel, hideEditor } = editableModel<Seller>()
  const dataGridRef = ref()
  const store = sellerStore()

  const findStamps = (model: Seller) => {
    const p = new Predicate({
      subject: 'sellerRef',
      operator: Operators.EQUALS,
      value: model.id
    })
    router.push({ path: '/stamps', query: { $filter: `${p.serialize()}` } })
  }

  const columnDefs = [
    new ColumnDefinition('name', { sort: 'asc', headerName: t('table-columns.name') }),
    ColumnDefinition.createActionIconColumn<Seller>(
      'sw-icon-edit',
      setEditModel,
      t('actions.edit')
    ),
    ColumnDefinition.createActionIconColumn<Seller>(
      'sw-icon-search',
      findStamps,
      t('actions.find-stamps')
    ),
    new ColumnDefinition('count', {
      maxWidth: 120,
      valueFormatter: stampCount,
      headerName: t('table-columns.count')
    }),
    new ColumnDefinition('description', { headerName: t('table-columns.description') })
  ]

  const filterChanged = (filterText: string) => {
    setFilterString(filterText)
  }

  const create = () => {
    setEditModel(createInstance<Seller>({}))
  }

  const remove = () => {
    const sel = selected.value
    if (sel) {
      Prompt.confirm({
        message: t('messages.delete-seller', { seller: sel.name })
      }).then(async (confirmed) => {
        if (confirmed) {
          await store.remove(sel)
          setSelected(undefined)
        }
      })
    }
  }

  const save = async () => {
    const editModel = getEditModel() as Seller
    if (editModel && editModel.id > 0) {
      await store.update(editModel)
    } else {
      await store.create(editModel)
    }
    hideEditor()
  }

  onMounted(async () => {
    dataGridRef.value.loadingStarted()
    const list = await store.find()
    await store.getStampCount()
    setCollection(list)
    dataGridRef.value.loadingComplete()
  })
</script>

<template>
  <div class="col-start-2 col-end-6 flex-auto flex-grow p-2 pr-0 flex flex-row">
    <div class="flex-grow flex-auto flex flex-col">
      <div class="flex mb-1">
        <PrimaryButton
          class="!pl-0.5 !py-0.25 w-38 h-6 mt-auto mb-1 border hidden lg:block"
          icon="sw-icon-plus"
          :tooltip="t('actions.new-seller')"
          @click="create()"
          id="create-seller"
        >
          {{ t('actions.new-seller') }}
        </PrimaryButton>
        <SecondaryButton
          class="ml-2 !px-0.5 !py-0.25 h-6 mt-auto mb-1 w-6 border !border-gray-400 hidden lg:block"
          icon="sw-icon-delete"
          :tooltip="selected ? t('actions.delete') : ''"
          id="delete-seller"
          @click="remove()"
          :disabled="!selected"
        >
        </SecondaryButton>
        <FilterInput
          class="ml-4 filter-input"
          :label="t('actions.filter')"
          :placeholder="t('form.filter-placeholder')"
          :filter-text="filterString"
          @filter-changed="filterChanged"
        ></FilterInput>
      </div>
      <DataGridComponent
        class=""
        ref="dataGridRef"
        :columnDefs="columnDefs"
        :rowData="filteredList"
        @selected="setSelected"
      >
      </DataGridComponent>
    </div>
    <TransitionRoot
      :show="isEditorShown()"
      enter="transition-opacity duration-75"
      enter-from="opacity-0"
      enter-to="opacity-100"
      leave="transition-opacity duration-150"
      leave-from="opacity-100"
      leave-to="opacity-0"
      class="max-w-[20rem] min-w-[20rem] h-full flex flex-col ml-2"
    >
      <SellerEditor :model="getEditModel()" @cancel="hideEditor()" @save="save()"></SellerEditor>
    </TransitionRoot>
  </div>
</template>
