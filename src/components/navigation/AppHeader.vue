<script setup lang="ts">
  import { onBeforeMount, computed, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import config from '@/components/config/ApplicationConfig'

  const { t } = useI18n()

  const url = ref('')
  const validUrl = computed(() => {
    return url.value !== ''
  })
  onBeforeMount(async () => {
    await config()
      .getConfiguration()
      .then((result) => {
        url.value = result.data?.plateFlawURL
      })
      .catch(() => {})
  })
</script>
<template>
  <div
    class="center flex flex-row flex-nowrap p-2 flex-grow w-full items-center bg-gray-900 text-gray-100"
  >
    <img alt="logo" class="w-8 h-8 mr-1" src="../../assets/images/stamp-web-64x64.png" />
    <h1 class="text-2xl truncate">{{ t('titles.stamp-web-editor') }}</h1>
    <div class="ml-auto">
      <a
        v-if="validUrl"
        class="text-xs text-gray-100 hover:underline hover:bg-transparent mr-2"
        :href="url"
      >
        <span class="sw-icon-imageburst mr-0.5"></span>{{ t('navigation.plate-flaws') }}
      </a>
      <a class="text-xs text-gray-100 hover:underline hover:bg-transparent" href="/aurelia"
        >{{ t('navigation.stamp-web') }}<span class="sw-icon-next"></span
      ></a>
    </div>
  </div>
</template>
