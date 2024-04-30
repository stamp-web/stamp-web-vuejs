<script setup lang="ts">
  import { ref, onMounted } from 'vue'

  import { Prompt } from '@/components/Prompt'
  import { TransitionRoot } from '@headlessui/vue'
  import DataGridComponent from '@/components/table/DataGridComponent.vue'
  import { type Catalogue } from '@/models/Catalogue'
  import { catalogueStore } from '@/stores/catalogueStore'
  import { createInstance } from '@/models/entityModels'
  import { CurrencyCode } from '@/models/CurrencyCode'
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
  import CatalogueEditor from '@/components/editors/CatalogueEditor.vue'

  const { t } = useI18n()
  const router = useRouter()

  const {
    setCollection,
    filterCollection,
    setFilterString,
    getFilteredList,
    getFilterString,
    getSelected,
    setSelected
  } = filterableCollection('catalogue-filter')

  const { isEditorShown, setEditModel, getEditModel, hideEditor } = editableModel()
  const dataGridRef = ref()
  const store = catalogueStore()

  const findStamps = (model: Catalogue) => {
    let p = new Predicate({
      subject: 'catalogueRef',
      operator: Operators.EQUALS,
      value: model.id
    })
    router.push({ path: '/stamps', query: { $filter: `${p.serialize()}` } })
  }

  const columnDefs = [
    new ColumnDefinition('issue', {
      maxWidth: 90,
      sort: 'desc',
      headerName: t('table-columns.issue')
    }),
    new ColumnDefinition('name', { headerName: t('table-columns.name') }),
    ColumnDefinition.createActionIconColumn('sw-icon-edit', setEditModel, t('actions.edit')),
    ColumnDefinition.createActionIconColumn('sw-icon-search', findStamps, t('actions.find-stamps')),
    new ColumnDefinition('count', {
      maxWidth: 120,
      valueFormatter: stampCount,
      headerName: t('table-columns.count')
    }),
    new ColumnDefinition('description', { headerName: t('table-columns.description') })
  ]

  const filterList = () => {
    dataGridRef.value.loadingStarted()
    filterCollection()
    dataGridRef.value.loadingComplete()
  }

  const filterChanged = (filterText: string) => {
    setFilterString(filterText)
    filterList()
  }

  const create = () => {
    setEditModel(createInstance<Catalogue>({ code: CurrencyCode.USD }))
  }

  const remove = () => {
    const selected = getSelected() as Catalogue
    if (selected) {
      Prompt.confirm({
        message: t('messages.delete-catalogue', { issue: selected.issue, catalogue: selected.name })
      }).then(async (confirmed) => {
        if (confirmed) {
          await store.remove(selected)
          // @ts-ignore
          setSelected(undefined)
          filterList()
        }
      })
    }
  }

  const save = async () => {
    const editModel = getEditModel() as Catalogue
    if (editModel && editModel.id > 0) {
      await store.update(editModel)
    } else {
      await store.create(editModel)
    }
    hideEditor()
    filterList()
  }

  onMounted(async () => {
    dataGridRef.value.loadingStarted()
    setCollection(await store.find())
    await store.getStampCount()
    filterList()
  })
</script>

<template>
  <div class="col-start-2 col-end-6 flex-auto flex-grow p-2 pr-0 flex flex-row">
    <div class="flex-grow flex-auto flex flex-col">
      <div class="flex mb-1">
        <PrimaryButton
          class="!pl-0.5 !py-0.25 w-38 h-6 mt-auto mb-1 border hidden lg:block"
          icon="sw-icon-plus"
          :tooltip="t('actions.new-catalogue')"
          @click="create()"
          id="create-seller"
        >
          {{ t('actions.new-catalogue') }}
        </PrimaryButton>
        <SecondaryButton
          class="ml-2 !px-0.5 !py-0.25 h-6 mt-auto mb-1 w-6 border !border-gray-400 hidden lg:block"
          icon="sw-icon-delete"
          :tooltip="getSelected() ? t('actions.delete') : ''"
          id="delete-catalogue"
          @click="remove()"
          :disabled="!getSelected()"
        >
        </SecondaryButton>
        <FilterInput
          class="ml-4 filter-input"
          :label="t('actions.filter')"
          :placeholder="t('form.filter-placeholder')"
          :filter-text="getFilterString()"
          @filter-changed="filterChanged"
        ></FilterInput>
      </div>
      <DataGridComponent
        class=""
        ref="dataGridRef"
        :columnDefs="columnDefs"
        :rowData="getFilteredList()"
        @selected="setSelected"
        @deselected="setSelected(undefined)"
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
      <CatalogueEditor
        :model="getEditModel()"
        @cancel="hideEditor()"
        @save="save()"
      ></CatalogueEditor>
    </TransitionRoot>
  </div>
</template>
