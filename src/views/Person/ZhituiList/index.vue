<!--
 * @Auth: Chenxu
 * @Date: 2020-01-17 16:13:54
 * @LastEditTime: 2020-03-07 18:43:49
 -->
<template>
  <div id="ZhituiList">
    <NavBar left-arrow left-text="返回" @click-left="onClickLeft" title="我的团队" />
    <div class="ZhituiListInner">
      <div class="total">
        <p class="item">
          直推人数：
          <span class="red">{{count||0}}</span>
        </p>
        <p class="item">
          团队人数：
          <span class="red">{{userInfo.team_count||0}}</span>
        </p>
      </div>
      <div class="total">
        <p class="item">
          直推活跃度：
          <span class="red">{{zhitui||0.00}}</span>
        </p>
        <p class="item">
          团队活跃度：
          <span class="red">{{userInfo.team_active||0.00}}</span>
        </p>
      </div>
      <DataList @setData="setData" :request="require('@/axios/api.js').ZhituiList">
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
import { mapState } from 'vuex';
export default {
  name: 'ZhituiList',
  components: {
    NavBar,
    Card,
    Button,
    DataList,
    TeamItem
  },
  created () {
    // component init
  },
  computed: {
    ...mapState(['userInfo'])
  },
  data () {
    return {
      list: [],
      count: 0,
      zhitui: 0
    }
  },
  methods: {
    //  methods init 
    setData (data) {
      this.list = data.list
      this.count = data.count
      this.zhitui = data.zhitui
    },
    onClickLeft () {
      this.$router.go(-1)
    },
    toDetailList () {
      this.$router.push('/person/awardlist')
    }
  }
}
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>