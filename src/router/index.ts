import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MainLayout from '@/layouts/MainLayout.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'app',
      component: MainLayout,
      children: [
        {
          path: '/',
          name: 'home',
          component: HomeView
        },
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
          path: '/stampCollections',
          name: 'stampCollections',
          component: () => import('@/views/StampCollections.vue')
        },
        {
          path: '/stampCollectionsDT',
          name: 'stampCollectionsDT',
          component: () => import('@/views/StampCollectionsDT.vue')
        },
        {
          path: '/about',
          name: 'about',
          // route level code-splitting
          // this generates a separate chunk (About.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import('../views/AboutView.vue')
        }
      ]
    }
  ]
})

export default router
