<!--
 * @Author: Chenxu
 * @Date: 2020-01-23 21:24:37
 * @LastEditTime: 2020-03-07 18:22:19
 -->
<template>
  <div class="team-item">
    <div class="wallet">
      <div class="top clearfix">
        <p class="yue van-ellipsis">{{item.username }}</p>
        <div class="center">
          <p v-if="item.mobile" class="text">手机号：{{item.mobile}}</p>
          <p v-if="item.amount" class="text">数量：{{item.amount}}</p>
          <p v-if="item.text" class="text">说明：{{item.text}}</p>
          <p v-if="item.createtime" class="text">注册时间：{{item.createtime}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  Card,
  Button,
  Tag,
  Toast
} from "vant";
export default {
  name: 'team-item',
  components: {
    Card,
    Button,
    Tag,
  },
  props: ['item', 'type'],
  methods: {
  }
}
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>