<!--
 * @Auth: Chenxu
 * @Date: 2020-01-17 16:13:54
 * @LastEditTime: 2020-03-16 22:47:36
 -->
<template>
  <div id="Share">
    <NavBar left-arrow left-text="返回" @click-left="onClickLeft" title="邀请好友" />
    <div class="page-inner-full">
      <div class="img-box">
        <div>
          <!-- <p @click="successToast" v-clipboard:copy="url" class="title">推广连接：{{url}}</p> -->
        </div>
        <QR class="image" :text="url" :margin="10" :size="150"></QR>
        <p @click="successToast" v-clipboard:copy="url" class="title link">复制推广连接</p>
        <p class="title">推广码：{{userInfo.tuiguang}}</p>
      </div>
      <!-- <van-image class="image" :src="url"></van-image> -->
    </div>
  </div>
</template>

<script>
import QR from "vue-qr";
import axios from "@/axios/request.js";
import { mapState } from 'vuex'
import {
  NavBar,
  Button,
  Toast
} from 'vant';
export default {
  name: 'Share',
  components: {
    NavBar,
    Button,
    QR
  },
  created () {
    this.getQrcode()
  },
  computed: {
    ...mapState(['userInfo'])
  },
  data () {
    return {
      url: ''
    }
  },
  methods: {
    successToast () {
      Toast('复制成功')
    },
    onClickLeft () {
      this.$router.back()
    },
    async getQrcode () {
      this.url = `http://mousefrontend.aiquanyouxuan.vip/login?type=1&up_id=${this.userInfo.tuiguang}`
    }
  }
}
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>