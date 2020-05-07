<!--
 * @Author: Chenxu
 * @Date: 2020-01-23 21:24:37
 * @LastEditTime: 2020-03-12 09:46:45
 -->
<template>
  <div class="trade-item">
    <Card @click="toInfo" lazy-load :title="'金豆'">
      <div class="plist" v-if="type!='list'" slot="desc">
        <p>
          数量：
          <span class="number">{{item.num}}</span>
          <span>豆子</span>
        </p>
        <p>
          价格：¥
          <span class="number">{{item.price}}</span>
        </p>
        <p v-if="item.status!=3 && item.status!=4">
          卖家：
          <span class="number">{{item.username}}</span>
        </p>
        <p v-if="item.status!=3 && item.status!=4">
          手机号码：
          <span class="number">{{item.user_mobile}}</span>
        </p>
        <p
          @click="successToast"
          v-clipboard:copy="item.user_mobile"
          v-if="item.status!=3 && item.status!=4"
        >
          支付宝账号：
          <span class="number">{{item.user_mobile}}</span>
          <span style="float:right;transform: scale(0.8);">点击复制</span>
        </p>
        <p v-if="item.status!=3 && item.status!=4">
          买家：
          <span class="number">{{item.buy_user_username}}</span>
        </p>

        <p v-if="item.status!=3 && item.status!=4">
          手机号码：
          <span class="number">{{item.buy_user_mobile}}</span>
        </p>
        <p v-if="item.status!=3 && item.status!=4">
          支付宝账号：
          <span class="number">{{item.buy_user_mobile}}</span>
        </p>

        <p>
          订单日期：
          <span class="number">{{item.createtime}}</span>
        </p>
      </div>

      <div v-else slot="desc">
        <p>
          数量：
          <span class="number">{{item.num}}</span>
        </p>
        <p v-if="item.status!=3 && item.status!=4">
          最大求购：
          <span class="number">{{item.max}}</span>
        </p>

        <p v-if="item.status!=3 && item.status!=4">
          最小求购：
          <span class="number">{{item.min}}</span>
        </p>
      </div>

      <div v-if="item.status!=3 && item.status!=4" slot="thumb" v-viewer="{toolbar:false}">
        <img class="thumb" v-if="item.image" :src="item.image" alt />
        <img class="thumb" v-else :src="require('@/assets/person/defaultImg.jpg')" alt />
      </div>

      <!-- 做条件判断 -->
      <div slot="footer">
        <Tag v-if="item.status_text" color="primary">{{item.status_text}}</Tag>
        <Button @click="$emit('del',item)" v-if="type=='list'" type="danger" round size="mini">取消</Button>
        <!-- 取消了支付流程 -->
        <!-- <Button
          @click="$emit('payOrder',item)"
          v-if="item.type == 1&&item.status==0"
          type="primary"
          round
          size="mini"
        >支付</Button>-->
        <Button
          @click="$emit('confirm')"
          v-if="item.type == 1&&item.status==2"
          type="primary"
          round
          size="mini"
        >确认</Button>
        <Button
          @click="$router.push(`/trade/commit/${item.id}`)"
          v-if="item.type == 0&&item.status==1"
          type="primary"
          round
          size="mini"
        >确认付款</Button>
      </div>
    </Card>

    <div class="margin-y"></div>
  </div>
</template>

<script>
import { tradeConfirm } from "@/axios/api.js";
import {
  Card,
  Button,
  Tag,
  Toast
} from "vant";
export default {
  name: 'trade-item',
  components: {
    Card,
    Button,
    Tag,
  },
  props: ['item', 'type'],
  mounted () {
    if (this.$route.params.goodId == this.item.trade_id) {
      this.$emit('payOrder', this.item)
    }
  },
  methods: {
    toInfo () {
      if (this.item.status == 3 || this.item.status == 4) {
        this.$router.push(`/trade/info/${this.item.id}`)
      }
    },
    successToast () {
      Toast('复制成功')
    }
  }
}
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>