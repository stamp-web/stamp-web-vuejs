<script setup lang="ts">
  import AppNavButton from '@/components/navigation/AppNavButton.vue'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
</script>
<template>
  <nav class="align-middle bg-gray-900 flex flex-row min-w-fit md:w-[120px] p-2">
    <AppNavButton :title="t('navigation.home')" link="/"></AppNavButton>
    <AppNavButton
      :title="t('navigation.stamp-collections')"
      link="/stampCollections"
    ></AppNavButton>
    <AppNavButton :title="t('navigation.albums')" link="/albums"></AppNavButton>
    <AppNavButton :title="t('navigation.countries')" link="/countries"></AppNavButton>
    <AppNavButton :title="t('navigation.sellers')" link="/sellers"></AppNavButton>
    <AppNavButton :title="t('navigation.catalogues')" link="/catalogues"></AppNavButton>
    <AppNavButton :title="t('navigation.stamps')" link="/stamps"></AppNavButton>
    <AppNavButton :title="t('navigation.about')" link="/about" class="mt-auto"></AppNavButton>
    <AppNavButton :title="t('navigation.settings')" link="/settings"></AppNavButton>
  </nav>
</template>
