<script setup lang="ts">
  import InfoItem from '@/components/navigation/InfoItem.vue'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
</script>

<template>
  <div class="flex w-full h-1 md:mt-4"></div>
  <InfoItem link="/stampCollections">
    <template #icon>
      <span class="sw-icon-stamp-collection scale-150"></span>
    </template>
    <template #heading>{{ t('models.stamp-collections.name') }}</template>
    {{ t('models.stamp-collections.description') }}
  </InfoItem>

  <InfoItem link="/albums">
    <template #icon>
      <span class="sw-icon-album scale-150"></span>
    </template>
    <template #heading>{{ t('models.albums.name') }}</template>
    {{ t('models.albums.description') }}
  </InfoItem>

  <InfoItem link="/countries">
    <template #icon>
      <span class="sw-icon-country scale-150"></span>
    </template>
    <template #heading>{{ t('models.countries.name') }}</template>
    {{ t('models.countries.description') }}
  </InfoItem>

  <InfoItem link="/sellers">
    <template #icon>
      <span class="sw-icon-seller scale-150"></span>
    </template>
    <template #heading>{{ t('models.sellers.name') }}</template>
    {{ t('models.sellers.description') }}
  </InfoItem>

  <InfoItem link="/catalogues">
    <template #icon>
      <span class="sw-icon-catalogue scale-150"></span>
    </template>
    <template #heading>{{ t('models.catalogues.name') }}</template>
    {{ t('models.catalogues.description') }}
  </InfoItem>

  <InfoItem link="/stamps">
    <template #icon>
      <span class="sw-icon-stamp scale-150"></span>
    </template>
    <template #heading>{{ t('models.stamps.name') }}</template>
    {{ t('models.stamps.description') }}
  </InfoItem>
</template>
