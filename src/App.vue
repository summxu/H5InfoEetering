<!--
 * @Auth: Chenxu
 * @Date: 2020-01-17 15:13:27
 * @LastEditTime : 2020-02-04 10:23:25
 -->
<template>
  <div id="app">
    <div class="layoute">
      <router-view />
    </div>
    <Tabbar v-show="tabShow" route>
      <TabbarItem to="/home" replace icon="home-o">首页</TabbarItem>
      <TabbarItem to="/order" replace icon="notes-o">订单</TabbarItem>
      <TabbarItem to="/person" replace icon="user-o">我的</TabbarItem>
    </Tabbar>
  </div>
</template>

<script>
import { NavBar, Tabbar, TabbarItem } from 'vant';
export default {
  name: 'App',
  components: { NavBar, Tabbar, TabbarItem },
  data () {
    return {
      tabShow: true
    }
  },
  watch: {
    '$route' () {
      switch (this.$route.name) {
        case 'home':
        case 'order':
        case 'person':
          this.tabShow = true
          break;

        default:
          this.tabShow = false
          break;
      }
    }
  }

}
</script>

<style lang="less">
/* base less  */
@import url("./utils/normalize.css");
@import url("./variables.css");
@import url("./utils/base.less");
@import url("./utils/good.less");

.layoute {
  box-sizing: border-box;

  padding-top: 120px;
}

.ant-footer {
  position: fixed;
  width: 100%;
  bottom: 0;

  .am-tab-bar-tab-icon {
    font-size: 30px;
  }
}
</style>
