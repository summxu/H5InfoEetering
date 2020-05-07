<!--
 * @Auth: Chenxu
 * @Date: 2020-01-17 16:13:54
 * @LastEditTime : 2020-01-29 15:22:34
 -->
<template>
  <div id="EquipList">
    <NavBar left-arrow left-text="返回" @click-left="onClickLeft" title="全部装备" />
    <div class="EquipInnerList">
      <DataList @setData="setData" :request="require('@/axios/api.js').EquipList">
        <EquipItem type="full" v-for="item in list" :key="item.id" :item="item"></EquipItem>
      </DataList>
    </div>
  </div>
</template>

<script>
import {
  NavBar,
  Card,
  Button
} from 'vant';
import DataList from "@/components/DataList";
import EquipItem from "@/components/EquipItem";
export default {
  name: 'EquipList',
  components: {
    NavBar,
    Card,
    Button,
    DataList,
    EquipItem
  },
  created () {
    // component init
  },
  data () {
    return {
      list: []
    }
  },
  methods: {
    //  methods init 
    setData (data) {
      this.list = data.list
    },
    onClickLeft () {
      this.$router.go(-1)
    },
  }
}
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>