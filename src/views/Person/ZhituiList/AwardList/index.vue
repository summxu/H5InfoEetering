<!--
 * @Auth: Chenxu
 * @Date: 2020-01-17 16:13:54
 * @LastEditTime: 2020-03-07 18:21:08
 -->
<template>
  <div id="AwardList">
    <NavBar left-arrow left-text="返回" @click-left="onClickLeft" title="收益明细" />
    <div class="AwardListInner">
      <Tabs @change="tabChange" v-model="active">
        <Tab title="金豆收益">
          <DataList
            v-if="active === 0"
            @setData="setData"
            :request="require('@/axios/api.js').salesInfo"
            :params="{status:1}"
          >
            <TeamItem v-for="item in list" :key="item.id" :item="item"></TeamItem>
          </DataList>
        </Tab>
        <Tab title="银豆收益">
          <DataList
            @setData="setData"
            v-if="active === 1"
            :request="require('@/axios/api.js').salesInfo"
            :params="{status:2}"
          >
            <TeamItem v-for="item in list" :key="item.id" :item="item"></TeamItem>
          </DataList>
        </Tab>
        <Tab title="达人奖励">
          <DataList
            @setData="setData"
            v-if="active === 2"
            :request="require('@/axios/api.js').salesInfo"
            :params="{status:4}"
          >
            <TeamItem v-for="item in list" :key="item.id" :item="item"></TeamItem>
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
  Tabs,
  Tab
} from 'vant';
import DataList from "@/components/DataList";
import TeamItem from "@/components/TeamItem";
export default {
  name: 'AwardList',
  components: {
    NavBar,
    Card,
    Button,
    DataList,
    TeamItem,
    Tabs,
    Tab
  },
  created () {
    // component init
  },
  data () {
    return {
      list: [],
      active: 0
    }
  },
  methods: {
    tabChange () {
      // 清空数据
      this.list = []
    },
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