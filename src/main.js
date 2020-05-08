/*
 * @Auth: Chenxu
 * @Date: 2020-01-17 15:13:27
 * @LastEditTime: 2020-03-14 09:11:14
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from "./i18n/index";
import VueI18n from "vue-i18n";
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'

import { Image, Lazyload } from 'vant';
Vue.use(Image).use(Lazyload).use(Viewer);

Vue.config.productionTip = false

// 多语言
Vue.use(VueI18n, {
  i18n: (key, value) => i18n.t(key, value)
});

/* 加载物理返回键 */
import "@/utils/handleBackButton";

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
