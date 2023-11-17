<script setup lang="ts">
  import InfoItem from '@/components/navigation/InfoItem.vue'
</script>

<template>
  <div class="flex w-full md:mt-4"></div>
  <InfoItem link="/stampCollections">
    <template #icon>
      <span class="sw-icon-stamp-collection"></span>
    </template>
    <template #heading>Stamp Collections</template>
    Stamp Collections is where you can manage your Stamp Collections allowing you to
    organize your albums.
  </InfoItem>

  <InfoItem link="/albums">
    <template #icon>
      <span class="sw-icon-album"></span>
    </template>
    <template #heading>Albums</template>
    Albums are used to store your stamps within a binder and make up part of a Stamp
    Collection.
  </InfoItem>

  <InfoItem link="/countries">
    <template #icon>
      <span class="sw-icon-country"></span>
    </template>
    <template #heading>Countries</template>
    Country represents the official postal authority that issued stamps for postal
    purposed. These include post offices in foreign countries and postal services
    organised by military occupations, colonies and revolutionary movements. official
    tools and libraries for your project:
  </InfoItem>

  <InfoItem link="/sellers">
    <template #icon>
      <span class="sw-icon-seller"></span>
    </template>
    <template #heading>Sellers</template>
    Sellers represent the selling agent for stamps and philatelic items. The seller could
    be an auction house, stamp dealer, association/society or an individual
  </InfoItem>

  <InfoItem link="/catalogues">
    <template #icon>
      <span class="sw-icon-catalogue"></span>
    </template>
    <template #heading>Catalogues</template>
    The stamp catalogue is a reference book that lists the stamps of a country or region
    and provides information on their values, design and history.
  </InfoItem>

  <InfoItem link="/stamps">
    <template #icon>
      <span class="sw-icon-stamp"></span>
    </template>
    <template #heading>Stamps</template>
    Stamps represent the physical postal item issued by an official postal authority.
  </InfoItem>
</template>
