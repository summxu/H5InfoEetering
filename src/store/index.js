/*
 * @Author: Chenxu
 * @Date: 2020-01-21 21:40:22
 * @LastEditTime : 2020-01-27 22:25:15
 */
import Vue from 'vue'
import Vuex from 'vuex'
import router from "@/router";
import { personInfo } from "@/axios/api";
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: null
  },
  mutations: {
    USER_INFO (state, { userInfo }) {
      // 7.1 把外界传来的userInfo保存到state中的userInfo
      state.userInfo = {
        ...state.userInfo,
        ...userInfo.userinfo
      }
      // 7.2 保存到本地缓存中
      localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
    },
    INIT_INFO (state, { userInfo }) {
      // 7.1 把外界传来的userInfo保存到state中的userInfo
      state.userInfo = userInfo
    },
    LOG_OUT (state) {
      state.userInfo = {};
      localStorage.clear()
      router.replace('/login')
    }
  },
  getters: {
    getterUserInfo ({ userInfo }) {
      return userInfo
    }
  },
  actions: {
    syncUserInfo ({ commit }, userInfo) {
      commit('USER_INFO', { userInfo });
    },
    initUserInfo ({ commit }, userInfo) {
      commit('INIT_INFO', { userInfo });
    },
    logOut ({ commit }) {
      commit('LOG_OUT');
    },
    async getPersonInfo ({ commit }) {
      try {
        let res = await personInfo()
        let payLoad = { userinfo: res.data }
        localStorage.clear()
        commit('USER_INFO', { userInfo: payLoad })
      } catch (error) {
        console.log(error);
      }
    }
  },
  modules: {}
})
