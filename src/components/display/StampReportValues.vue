<script setup lang="ts">
  import { onBeforeMount, onMounted, ref } from 'vue'
  import { ReportType, ReportTypeHelper } from '@/models/ReportType'
  import ToggleButtonGroup from '@/components/buttons/ToggleButtonGroup.vue'
  import { ButtonGroupModel } from '@/components/buttons/ButtonGroupModel'

  const props = defineProps({
    reportType: Number,
    value: String
  })
  const emit = defineEmits(['report-type-changed'])

  const model = ref({
    reportType: ReportType.CatalogueValue
  })

  const reportModels: Array<ButtonGroupModel> = []

  const toggleClicked = (mode: ReportType) => {
    model.value.reportType = mode
    emit('report-type-changed', model.value.reportType)
  }

  onBeforeMount(() => {
    model.value.reportType = props.reportType || ReportType.CatalogueValue

    ReportTypeHelper.toArray().forEach((reportModel) => {
      let icon = 'sw-icon-catalogue'
      const val = parseInt(reportModel.value)
      if (val === ReportType.CostBasis) {
        icon = 'sw-icon-purchased'
      } else if (val === ReportType.CashValue) {
        icon = 'sw-icon-cash-value'
      }
      const toggled = parseInt(reportModel.value) == model.value.reportType
      reportModels.push(
        ButtonGroupModel.newInstance(reportModel.value, icon, toggled, reportModel.label)
      )
    })
  })

  onMounted(() => {})
</script>
<template>
  <div class="flex">
    <span class="ml-1 align-middle contents whitespace-nowrap text-0.5sm">{{ props.value }}</span>
    <toggle-button-group
      class="scale-75"
      :models="reportModels"
      @toggle-changed="toggleClicked"
    ></toggle-button-group>
  </div>
</template>
