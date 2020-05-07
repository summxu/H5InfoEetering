<!--
 * @Author: Chenxu
 * @Date: 2020-01-23 21:24:37
 * @LastEditTime: 2020-03-09 21:32:19
 -->
<template>
  <div class="equip-item">
    <Card
      lazy-load
      :tag="item.max?`同时:${item.max}`:false"
      currency="金豆："
      :price="item.gold_bean"
      :title="item.name"
      :thumb="item.image || require('@/assets/person/defaultImg.jpg')"
    >
      <div slot="price">
        <span>
          金豆：
          <span style="font-size:16px;color:red;margin-right:5px">{{item.gold_bean}}</span>
          <img
            style="width:12px;height:12px;vertical-align: middle;"
            :src="require('@/assets/beans.png')"
            alt
          />
        </span>
      </div>
      <div slot="desc">
        <p v-if="item.days">
          有效期：
          <span class="number">{{item.days}}天</span>
        </p>
        <p v-if="item.active">
          活跃度：
          <span class="number">{{item.active}}</span>
        </p>
        <p v-if="item.yield">
          金豆产量：
          <span class="number">{{item.yield}}</span>
        </p>
        <p v-if="item.endtime">
          到期时间：
          <span class="number">{{item.endtime}}</span>
        </p>
      </div>
      <!-- 做条件判断 -->
      <div v-if="type == 'full'" slot="footer">
        <Button type="info" round size="mini" @click="duihuan">兑换</Button>
      </div>
    </Card>
    <div class="margin-y"></div>
  </div>
</template>

<script>
import {
  Card,
  Button,
  Tag,
  Toast
} from "vant";
import { buyEquip } from "@/axios/api.js";
export default {
  name: 'equip-item',
  components: {
    Card,
    Button,
    Tag,
  },
  props: ['item', 'type'],
  methods: {
    async duihuan () {
      try {
        let res = await buyEquip({ equip_id: this.item.id })
        Toast.success(res.msg)
      } catch (error) {
        console.log(error);
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>