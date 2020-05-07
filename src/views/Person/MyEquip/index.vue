<!--
 * @Auth: Chenxu
 * @Date: 2020-01-17 16:13:54
 * @LastEditTime : 2020-01-29 13:35:31
 -->
<template>
  <div id="MyEquip">
    <NavBar left-arrow left-text="返回" @click-left="onClickLeft" title="我的装备" />
    <div class="MyEquipInner">
      <DataList @setData="setData" :request="require('@/axios/api.js').myEquip">
        <EquipItem v-for="item in list" :key="item.id" :item="item"></EquipItem>
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
  name: 'MyEquip',
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