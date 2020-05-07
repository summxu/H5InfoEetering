<!--
 * @Auth: Chenxu
 * @Date: 2020-01-17 16:13:54
 * @LastEditTime : 2020-01-30 19:03:51
 -->
<template>
  <div id="MyGoods">
    <ShowPassword @over="payOrder" v-if="ShowPassword" @close="ShowPassword = false" />

    <NavBar left-arrow left-text="返回" @click-left="onClickLeft" title="我的购买" />
    <div class="MyGoodsInner margin-top-up">
      <Tabs @change="tabChange" v-model="active">
        <Tab title="待付款">
          <DataList
            v-if="active === 0"
            :refresh="refreshList"
            @setData="setData"
            :params="{type:0,status:active}"
            :request="require('@/axios/api.js').goodsBuyOrder"
          >
            <GoodsItem
              @payOrder="payOrderBefore"
              @delOrder="delOrder"
              v-for="item in list"
              :key="item.id"
              :item="item"
            ></GoodsItem>
          </DataList>
        </Tab>
        <Tab title="待发货">
          <DataList
            v-if="active === 1"
            @setData="setData"
            :params="{type:0,status:active}"
            :request="require('@/axios/api.js').goodsBuyOrder"
          >
            <GoodsItem v-for="item in list" :key="item.id" :item="item"></GoodsItem>
          </DataList>
        </Tab>
        <Tab title="已发货">
          <DataList
            v-if="active === 2"
            :refresh="refreshList"
            @setData="setData"
            :params="{type:0,status:active}"
            :request="require('@/axios/api.js').goodsBuyOrder"
          >
            <GoodsItem @shouhuo="shouhuoOrder" v-for="item in list" :key="item.id" :item="item"></GoodsItem>
          </DataList>
        </Tab>
        <Tab title="已完成">
          <DataList
            v-if="active === 3"
            @setData="setData"
            :params="{type:0,status:active}"
            :request="require('@/axios/api.js').goodsBuyOrder"
          >
            <GoodsItem v-for="item in list" :key="item.id" :item="item"></GoodsItem>
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
  Toast
} from 'vant';
import { payOrder, delOrder, confirmGoods } from "@/axios/api.js";
import ShowPassword from "@/components/ShowPassword";
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
    ShowPassword
  },
  created () { },
  data () {
    return {
      active: this.$route.params.index || 0,
      refreshList: 0,
      list: [],
      order_id: '',
      ShowPassword: false
    }
  },
  methods: {
    //  methods init 
    onClickLeft () {
      this.$router.go(-1)
    },
    setData (data) {
      this.list = data.list
    },
    tabChange () {
      // 清空数据
      this.list = []
    },
    payOrderBefore (item) {
      this.order_id = item.id
      this.ShowPassword = true
    },
    async delOrder (item) {
      console.log(item);
      try {
        let params = {
          order_id: item.id
        }
        let res = await delOrder(params)
        this.refreshList = Math.random()
        Toast.success(res.msg)
      } catch (error) {
        console.log(object);
      }
    },
    async shouhuoOrder (item) {
      try {
        let params = {
          order_id: item.id
        }
        let res = await confirmGoods(params)
        this.refreshList = Math.random()
        Toast.success(res.msg)
      } catch (error) {
        console.log(error);
      }
    },
    async payOrder (password) {
      try {
        let params = {
          order_id: this.order_id,
          pay_password: password
        }
        this.ShowPassword = false
        let res = await payOrder(params)
        this.refreshList = Math.random()
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