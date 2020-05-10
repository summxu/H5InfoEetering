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
        <Tab v-for="(element,index) in tabs " :key="index" :title="element.title">
          <DataList
            v-if="active == index"
            :refresh="refreshList"
            @setData="setData"
            :request="require('@/axios/api.js').orderList"
          >
            <CellGroup
              v-for="item in filterList(element.status)"
              :key="item.id"
              :title="'订单编号：'+item.out_trade_no"
            >
              <Cell
                icon="point-gift"
                :title="item.goods_info.length +'个包裹'"
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
      tabs: [{
        title: '全部',
        status: [0, 1, 2, 3, 4, 5, 6, 7]
      }, {
        title: '审核中',
        status: [0]
      }, {
        title: '已驳回',
        status: [1]
      }, {
        title: '待发货',
        status: [2]
      }, {
        title: '发货中',
        status: [2, 3]
      }, {
        title: '待出库',
        status: [4]
      }, {
        title: '已完成',
        status: [7]
      }]
    }
  },
  methods: {
    filterList (arr) {
      return this.list.filter(item => {
        return arr.findIndex(element => element == item.status) != -1
      })
    },
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