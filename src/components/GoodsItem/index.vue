<!--
 * @Author: Chenxu
 * @Date: 2020-01-23 21:24:37
 * @LastEditTime: 2020-03-12 09:23:41
 -->
<template>
  <div class="goods-item">
    <Card :num="item.num" lazy-load :price="item.sum_price" :title="item.name" :thumb="item.image">
      <div slot="desc">
        <p v-if="type !== 'seller'">
          订单号：
          <span class="number">{{item.order_sn}}</span>
        </p>
        <p v-if="type !== 'seller'">
          订单日期：
          <span class="number">{{item.createtime}}</span>
        </p>
        <p v-else>
          上架日期：
          <span class="number">{{item.createtime}}</span>
        </p>
        <p v-if="item.ps">
          留言：
          <span class="number">{{item.ps}}</span>
        </p>
        <p v-if="item.wuliu">
          物流单号：
          <span class="number">{{item.wuliu}}</span>
        </p>
      </div>
      <!-- 做条件判断 -->
      <div v-if="type!=='start'" slot="tags">
        <Tag plain type="danger">{{item.cate_text}}</Tag>
      </div>

      <div v-if="type === 'start'" slot="footer">
        <Button type="danger" round size="mini" @click="noStart">取消收藏</Button>
      </div>

      <div v-else slot="footer">
        <!-- <Tag v-if="Number(item.is_check)" plain type="danger">{{item.is_check_text}}</Tag> -->
        <Button
          v-if="Number(item.is_check)"
          :to="`/shop/goodadd/${item.id}`"
          type="info"
          round
          size="mini"
        >编辑</Button>
        <Button
          v-if="item.status == 0"
          type="danger"
          @click="$emit('delOrder',item)"
          round
          size="mini"
        >删除</Button>
        <Button
          @click="$emit('payOrder',item)"
          v-if="type !== 'seller'&&item.status==0"
          type="primary"
          round
          size="mini"
        >付款</Button>
        <Button
          @click="$emit('fahuo',item)"
          v-if="type === 'seller'&&item.status==1"
          type="primary"
          round
          size="mini"
        >发货</Button>
        <Button
          @click="$emit('shouhuo',item)"
          v-if="type !== 'seller'&&item.status==2"
          type="primary"
          round
          size="mini"
        >确认收货</Button>

        <div style="display:inline-block" v-if="item.is_check && item.is_up">
          <!-- 出售中上下架 -->
          <Tag v-if="item.is_check == 0" plain type="danger">审核中</Tag>
          <Tag v-else plain type="primary">审核通过</Tag>
          <Button
            @click="$emit('upHandle',item)"
            v-if="item.is_up == '1'"
            type="danger"
            round
            size="mini"
          >下架</Button>
          <Button
            @click="$emit('upHandle',item)"
            v-if="item.is_up != '1'"
            type="primary"
            round
            size="mini"
          >上架</Button>
        </div>
      </div>
    </Card>

    <div class="margin-y"></div>
  </div>
</template>

<script>
import {
  Card,
  Button,
  Tag
} from "vant";
export default {
  name: 'goods-item',
  components: {
    Card,
    Button,
    Tag,
  },
  props: ['item', 'type'],
  mounted () {
    if (this.$route.params.goodId == this.item.goods_id) {
      // this.payOrder(this.$route.params.id)
      console.log(this.item);
      this.$emit('payOrder', this.item)
    }
  },
  methods: {
    noStart () {
      this.$emit('noStart')
    },
  }
}
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>