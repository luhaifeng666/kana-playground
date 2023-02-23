/*
 * @Author: luhaifeng666 youzui@hotmail.com
 * @Date: 2023-02-20 21:13:47
 * @LastEditors: luhaifeng666
 * @LastEditTime: 2023-02-23 15:14:57
 * @Description: 
 */
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/kana',
      name: 'kana',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/KanaView.vue')
    },
    {
      path: '/playground',
      name: 'playground',
      component: () => import('../views/PlaygroundView.vue')
    },
    {
      path: '/record',
      name: 'record',
      component: () => import('../views/RecordView.vue')
    }
  ]
})

export default router
