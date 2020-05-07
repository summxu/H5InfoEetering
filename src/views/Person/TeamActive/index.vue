<!--
 * @Auth: Chenxu
 * @Date: 2020-01-17 16:13:54
 * @LastEditTime: 2020-02-16 18:05:18
 -->
<template>
  <div id="TeamActive">
    <NavBar left-arrow left-text="返回" @click-left="onClickLeft" title="活跃度明细" />
    <div class="TeamActiveInner">
      <Tabs @change="tabChange" v-model="active">
        <Tab title="团队明细">
          <DataList
            v-if="active === 0"
            @setData="setData"
            :request="require('@/axios/api.js').TeamActive"
          >
            <TeamItem v-for="item in list" :key="item.id" :item="item"></TeamItem>
          </DataList>
        </Tab>
        <Tab title="直推明细">
          <DataList
            @setData="setData"
            v-if="active === 1"
            :request="require('@/axios/api.js').salesInfo"
            :params="{status:3}"
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
  Tab,
  Tabs
} from 'vant';
import DataList from "@/components/DataList";
import TeamItem from "@/components/TeamItem";
export default {
  name: 'TeamActive',
  components: {
    NavBar,
    Card,
    Button,
    DataList,
    TeamItem,
    Tab,
    Tabs
  },
  created () {
    // component init
  },
  data () {
    return {
      list: [],
      count: 0,
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
      this.count = data.team_active
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