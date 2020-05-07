/*
 * @Auth: Chenxu
 * @Date: 2020-01-17 15:13:27
 * @LastEditTime: 2020-03-14 10:05:49
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home'
import store from "@/store";
import { Toast } from "vant";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
  }, {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login')
  }, {
    path: '/home',
    name: 'home',
    component: () => import('@/views/Home')
  }, {
    path: '/order',
    name: 'order',
    component: () => import('@/views/Order')
  }, {
    path: '/person',
    name: 'person',
    component: () => import('@/views/Person')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})


/* 路由守卫 */
router.beforeEach((to, from, next) => {
  // chrome
  document.body.scrollTop = 0
  // firefox
  document.documentElement.scrollTop = 0
  // safari
  window.pageYOffset = 0
  /* sync vuex from localstorage */
  let userInfo = JSON.parse(localStorage.getItem('userInfo'))
  /* author check */
  if (!userInfo) {
    if (to.path !== '/login') {
      router.replace('/login')
      Toast('登录信息失效,请重新登录')
    }
  } else if (!store.getters.getterUserInfo) {
    store.dispatch('initUserInfo', userInfo)
  }
  next()
})

export default router
