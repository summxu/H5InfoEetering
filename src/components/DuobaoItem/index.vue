<!--
 * @Author: Chenxu
 * @Date: 2020-01-23 21:14:06
 * @LastEditTime : 2020-02-02 16:46:19
 -->
<template>
  <div class="duobao-item">
    <Card
      :num="item.num||item.all_num"
      centered
      lazy-load
      :title="item.name||`手机：${item.mobile}`"
      :thumb="item.image||require('@/assets/person/defaultImg.jpg')"
      @click="toLuckNumber"
    >
      <div slot="desc">
        <p>{{item.sum_price?`价格：${item.sum_price}`:`时间：${item.end_time}`}}</p>
        <p>期数：{{item.floor}}</p>
        <p v-if="item.user_address">收货地址：{{item.user_address.area+ ' ' + item.user_address.info}}</p>
      </div>
      <div slot="price">
        <p v-if="item.number &&item.status!='0'">幸运号码：{{item.number}}</p>
        <CountDown @finish="finishFun" millisecond v-else :time="time">
          <template v-slot="timeData">
            <div v-if="item.end_time">
              <span class="item-text">剩余开奖时间：</span>
              <span class="item">{{ timeData.seconds }}</span>
              <span class="item-text">&nbsp;:&nbsp;</span>
              <span class="item">{{ timeData.milliseconds }}</span>
            </div>
            <div v-else>
              <span class="item-text">未达到开奖条件</span>
            </div>
          </template>
        </CountDown>
      </div>
      <!-- 做条件判断 -->
      <div v-if="showDuihuan" slot="footer">
        <Button @click.stop="$emit('duihuan',item)" type="primary" round size="mini">兑换</Button>
      </div>
    </Card>
    <div class="margin-y"></div>
  </div>
</template>

<script>
import {
  Card,
  Button,
  CountDown
} from "vant";
import { duobaoSetwin } from "@/axios/api.js";
export default {
  name: 'duobao-item',
  components: {
    Card,
    Button,
    CountDown
  },
  props: ['item', 'showDuihuan'],
  computed: {
    time () {
      let newTimeS = Date.parse(new Date())
      return this.item.end_time * 1000 - newTimeS
    }
  },
  created () {
    this.checkSetwin()
  },
  methods: {
    /* 检查需不需要设置为已揭晓 */
    async checkSetwin () {
      if (this.item.end_time && this.item.status == '0') {
        let params = {
          id: this.item.duobao_id
        }
        let res = await duobaoSetwin(params)
      }
    },
    toLuckNumber () {
      this.$router.push(`/duobao/lucknumber/${this.item.id}`)
    },
    finishFun () {
      /* 计时结束 */
      this.$emit('onRefresh')
    }
  }
}
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>