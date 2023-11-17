import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  // @ts-ignore
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/browse',
      name: 'app',
      component: () => import('@/layouts/MainLayout.vue'),
      children: [
        {
          path: '/countries',
          name: 'countries',
          component: () => import('@/views/Countries.vue')
        },
        {
          path: '/albums',
          name: 'albums',
          component: () => import('@/views/Albums.vue')
        },
        {
          path: '/catalogues',
          name: 'catalogues',
          component: () => import('@/views/Catalogues.vue')
        },
        {
          path: '/sellers',
          name: 'sellers',
          component: () => import('@/views/Sellers.vue')
        },
        {
          path: '/stamps',
          name: 'stamps',
          component: () => import('@/views/Stamps.vue')
        },
        {
          path: '/stampCollections',
          name: 'stampCollections',
          component: () => import('@/views/StampCollections.vue')
        },
        {
          path: '/about',
          name: 'about',
          component: () => import('../views/AboutView.vue')
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
