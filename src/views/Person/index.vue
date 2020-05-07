<!--
 * @Auth: Chenxu
 * @Date: 2020-01-17 16:13:54
 * @LastEditTime: 2020-03-08 14:26:24
 -->
<template>
  <div id="Person">
    <NavBar title="我的" />

    <div class="person-bg"></div>
    <div class="page-inner">
      <div class="user-info">
        <div class="left">
          <img v-if="userInfo.avatar" :src="userInfo.avatar" alt />
          <img v-else :src="require('@/assets/person/defaultImg.jpg')" alt />
          <div class="info">
            <p class="nickname van-ellipsis">{{userInfo.username || '无名氏'}}</p>
          </div>
        </div>
      </div>

      <Button style="margin-top:50px" type="danger" @click="logOut" block>退出登录</Button>
    </div>
  </div>
</template>

<script>
import {
  NavBar,
  Row,
  Col,
  NoticeBar,
  Button,
  Grid,
  GridItem,
  CellGroup,
  Toast,
  Dialog,
  Stepper
} from 'vant';
import { mapState, mapActions, mapMutations } from 'vuex'
import { personInfo, goldToSilver, silverToGold } from "@/axios/api.js";
export default {
  name: 'Person',
  components: {
    NavBar,
    NoticeBar,
    Button,
    Grid,
    GridItem,
    CellGroup,
    [Dialog.Component.name]: Dialog.Component,
    Stepper
  },
  created () {
    // component init
    this.getPersonInfo()
  },
  computed: {
    ...mapState(['userInfo'])
  },
  data () {
    return {
      show: false,
      trans: {
        show: false,
        title: '金豆转银豆',
        value: 1,
        type: 0
      }
    }
  },
  methods: {
    /* 同步用户信息 */
    ...mapActions(['syncUserInfo', 'getPersonInfo', 'logOut'])
  }
}
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>