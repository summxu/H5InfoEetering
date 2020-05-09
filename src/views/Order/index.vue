<!--
 * @Auth: Chenxu
 * @Date: 2020-01-17 16:13:54
 * @LastEditTime : 2020-01-30 19:03:51
 -->
<template>
  <div id="MyGoods">
    <NavBar title="订单列表" />
    <div class="MyGoodsInner margin-top-up">
      <Tabs @change="tabChange" v-model="active">
        <Tab title="待付款">
          <DataList
            :refresh="refreshList"
            @setData="setData"
            :request="require('@/axios/api.js').orderList"
          >
            <CellGroup v-for="item in list" :key="item.id" :title="'订单编号：'+item.out_trade_no">
              <Cell
                icon="point-gift"
                :title="item.goods_info.length ? item.goods_info[0].goods_name + '....':'没有货物'"
                :value="item.create_time"
                is-link
                :to="`detail/${item.id}`"
              />
            </CellGroup>
          </DataList>
        </Tab>
      </Tabs>
    </div>
  </div>
</template>

<script>
import {
  NavBar,
  Card,
  Button,
  Tab,
  Tabs,
  Toast,
  CellGroup,
  Cell
} from 'vant';
import { orderList } from "@/axios/api.js";
import DataList from "@/components/DataList";
import GoodsItem from "@/components/GoodsItem";
export default {
  name: 'MyGoods',
  components: {
    NavBar,
    Card,
    Button,
    Tab,
    Tabs,
    DataList,
    GoodsItem,
    CellGroup,
    Cell
  },
  created () { },
  data () {
    return {
      active: this.$route.params.index || 0,
      refreshList: 0,
      list: [],
      order_id: '',
    }
  },
  methods: {
    setData (data) {
      this.list = data.list
    },
    tabChange () {
      // 清空数据
      this.list = []
    }
  }
}
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>