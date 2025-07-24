import { createRouter, createWebHashHistory } from 'vue-router'

type ImportMetaEnv = {
  BASE_URL: string
}

type AppImportMeta = ImportMeta & {
  env: ImportMetaEnv
}

const router = createRouter({
  history: createWebHashHistory((import.meta as AppImportMeta).env.BASE_URL),
  routes: [
    {
      path: '/browse',
      name: 'app',
      component: () => import('@/layouts/MainLayout.vue'),
      children: [
        {
          path: '/countries',
          name: 'countries',
          component: () => import('@/views/CountriesView.vue')
        },
        {
          path: '/albums',
          name: 'albums',
          component: () => import('@/views/AlbumsView.vue')
        },
        {
          path: '/catalogues',
          name: 'catalogues',
          component: () => import('@/views/CataloguesView.vue')
        },
        {
          path: '/sellers',
          name: 'sellers',
          component: () => import('@/views/SellersView.vue')
        },
        {
          path: '/stamps',
          name: 'stamps',
          component: () => import('@/views/StampsView.vue')
        },
        {
          path: '/stampCollections',
          name: 'stampCollections',
          component: () => import('@/views/StampCollectionsView.vue')
        },
        {
          path: '/about',
          name: 'about',
          component: () => import('../views/AboutView.vue')
        },
        {
          path: '/settings',
          name: 'settings',
          component: () => import('../views/SettingsView.vue')
        }
      ]
    },
    {
      path: '/',
      name: 'full-display',
      component: () => import('@/layouts/HeaderOnlyLayout.vue'),
      children: [
        {
          path: '/',
          name: 'home',
          component: () => import('@/views/HomeView.vue')
        }
      ]
    }
  ]
})

export default router
