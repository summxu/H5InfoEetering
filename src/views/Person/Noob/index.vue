<!--
 * @Auth: Chenxu
 * @Date: 2020-01-17 16:13:54
 * @LastEditTime: 2020-03-08 14:33:41
 -->
<template>
  <div id="Noob">
    <NavBar left-arrow left-text="返回" @click-left="onClickLeft" title="新手教程" />
    <div class="page-inner">
      <div class="rich-text" v-html="content"></div>
    </div>
  </div>
</template>

<script>
import { getNoob } from "@/axios/api.js";
import { mapState } from 'vuex'
import {
  NavBar,
  Button,
} from 'vant';
export default {
  name: 'Noob',
  components: {
    NavBar,
    Button
  },
  created () {
    this.getNoob()
  },
  computed: {
    ...mapState(['userInfo'])
  },
  data () {
    return {
      content: ''
    }
  },
  methods: {
    async getNoob () {
      let res = await getNoob()
      this.content = res.data.content
    },
    onClickLeft () {
      this.$router.back()
    },
  }
}
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>