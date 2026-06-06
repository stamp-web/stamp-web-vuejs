<script lang="ts" setup>
  import { inject, onMounted, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import axios from 'axios'
  import { findBasePath } from '@/util/href-utils'
  import type { Log } from 'vuejs3-logger'

  const { t } = useI18n()
  const logger = inject('vuejs3-logger') as Log
  const loading = ref(true)
  const buildInfo = ref<Record<string, number | string> | null>(null)

  onMounted(async () => {
    try {
      const basePath = findBasePath(window.location.pathname)
      const response = await axios.get(`${basePath}build-number.json`)
      buildInfo.value = response.data
    } catch (e) {
      logger.warn('Failed to load build-number.json', e)
    } finally {
      loading.value = false
    }
  })
</script>

<template>
  <div class="col-start-2 col-end-6 flex-auto flex-grow p-6 flex flex-row overflow-y-hidden bg-gray-50">
    <div class="flex-grow flex-auto flex flex-col overflow-y-auto max-w-4xl mx-auto space-y-6">
      
      <!-- Header Section -->
      <div class="bg-gradient-to-r from-[var(--vf-primary)] to-emerald-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div class="absolute right-0 top-0 opacity-10 transform translate-x-12 -translate-y-12">
          <span class="sw-icon-stamp text-9xl"></span>
        </div>
        <h1 class="text-3xl font-bold tracking-tight mb-2">{{ t('about.title') }}</h1>
        <p class="text-emerald-50 text-sm max-w-2xl leading-relaxed">
          {{ t('about.description') }}
        </p>
      </div>

      <!-- Content Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- Application Details Card -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <h2 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span class="sw-icon-about text-[var(--vf-primary)]"></span>
              {{ t('navigation.about') }}
            </h2>
            
            <div class="space-y-4">
              <div class="flex flex-col pb-3 border-b border-gray-100">
                <span class="text-gray-400 text-xs font-semibold uppercase tracking-wider">{{ t('about.version') }}</span>
                <span class="text-gray-700 font-medium text-sm mt-0.5">7.0.0</span>
              </div>
              
              <div class="flex flex-col pb-3 border-b border-gray-100">
                <span class="text-gray-400 text-xs font-semibold uppercase tracking-wider">{{ t('about.author') }}</span>
                <span class="text-gray-700 font-medium text-sm mt-0.5">
                  Jason A. Drake 
                  <a href="mailto:jadrake75@gmail.com" class="text-[var(--vf-primary)] hover:underline text-xs ml-1">
                    &lt;jadrake75@gmail.com&gt;
                  </a>
                </span>
              </div>

              <div class="flex flex-col pb-3 border-b border-gray-100">
                <span class="text-gray-400 text-xs font-semibold uppercase tracking-wider">{{ t('about.license') }}</span>
                <span class="text-gray-700 font-medium text-sm mt-0.5">Apache-2.0</span>
              </div>
            </div>
          </div>

          <!-- Project Links -->
          <div class="mt-8 pt-4 border-t border-gray-100">
            <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{{ t('about.project-links') }}</h3>
            <div class="space-y-2">
              <a 
                href="https://github.com/stamp-web/stamp-web-vuejs" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 hover:border-[var(--vf-primary)] hover:bg-emerald-50/20 transition-all group"
              >
                <span class="text-sm font-medium text-gray-700 group-hover:text-[var(--vf-primary-darker)]">stamp-web-vuejs</span>
                <svg class="w-4 h-4 text-gray-400 group-hover:text-[var(--vf-primary)]" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
                </svg>
              </a>
              
              <a 
                href="https://github.com/stamp-web/stamp-web-aurelia" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 hover:border-[var(--vf-primary)] hover:bg-emerald-50/20 transition-all group"
              >
                <span class="text-sm font-medium text-gray-700 group-hover:text-[var(--vf-primary-darker)]">stamp-web-aurelia</span>
                <svg class="w-4 h-4 text-gray-400 group-hover:text-[var(--vf-primary)]" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
                </svg>
              </a>

              <a 
                href="https://github.com/stamp-web/stamp-webservices" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 hover:border-[var(--vf-primary)] hover:bg-emerald-50/20 transition-all group"
              >
                <span class="text-sm font-medium text-gray-700 group-hover:text-[var(--vf-primary-darker)]">stamp-webservices</span>
                <svg class="w-4 h-4 text-gray-400 group-hover:text-[var(--vf-primary)]" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <!-- Component Versions Card -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
          <h2 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span class="sw-icon-components text-[var(--vf-primary)]"></span>
            {{ t('about.component-versions') }}
          </h2>

          <!-- Loading State -->
          <div v-if="loading" class="flex-grow flex flex-col items-center justify-center py-12 space-y-3">
            <div class="w-8 h-8 border-2 border-emerald-100 border-t-[var(--vf-primary)] rounded-full animate-spin"></div>
            <span class="text-gray-400 text-xs">{{ t('about.loading') }}</span>
          </div>

          <!-- Empty/Error State -->
          <div v-else-if="!buildInfo || Object.keys(buildInfo).length === 0" class="flex-grow flex flex-col items-center justify-center py-12 text-center">
            <span class="text-gray-300 text-4xl mb-2">⚠️</span>
            <span class="text-gray-500 text-sm font-medium">{{ t('about.no-build-info') }}</span>
          </div>

          <!-- Data State -->
          <div v-else class="flex-grow space-y-3">
            <div 
              v-for="(version, component) in buildInfo" 
              :key="component"
              class="flex items-center justify-between p-3 rounded-xl bg-gray-50/60 border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <span class="text-sm font-semibold text-gray-700 capitalize">{{ component }}</span>
              <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100/70 text-emerald-800">
                Build #{{ version }}
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<style scoped>
  /* Subtle fade-in animation */
  .col-start-2 {
    animation: fadeIn 0.35s ease-out;
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
