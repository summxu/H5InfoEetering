<!--
 * @Auth: Chenxu
 * @Date: 2020-01-17 16:13:54
 * @LastEditTime : 2020-02-14 18:02:37
 -->
<template>
  <div id="DataDetail">
    <NavBar left-arrow left-text="返回" @click-left="onClickLeft" :title="title" />
    <div class="DataDetailInner">
      <DataList
        @setData="setData"
        :request="require('@/axios/api.js').salesInfo"
        :params="{status}"
      >
        <TeamItem v-for="item in list" :key="item.id" :item="item"></TeamItem>
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
import TeamItem from "@/components/TeamItem";
export default {
  name: 'DataDetail',
  components: {
    NavBar,
    Card,
    Button,
    DataList,
    TeamItem
  },
  created () {
    let type = this.$route.params.type
    this.status = type
    switch (type) {
      case '1':
        this.title = '金豆明细'
        break;
      case '2':
        this.title = '银豆明细'
        break;
      case '3':
        this.title = '活跃度明细'
        break;
    }
  },
  data () {
    return {
      list: [],
      status: 1,
      title: '信息明细'
    }
  },
  methods: {
    //  methods init 
    setData (data) {
      this.list = data.list
    },
    onClickLeft () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>