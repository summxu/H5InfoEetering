<!--
 * @Auth: Chenxu
 * @Date: 2020-01-17 16:13:54
 * @LastEditTime: 2020-03-08 21:22:11
 -->
<template>
  <div class="cx-data-list">
    <PullRefresh v-model="isLoading" success-text="刷新成功" @refresh="onRefresh">
      <List v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <slot></slot>
      </List>
    </PullRefresh>
  </div>
</template>

<script>
import { List, PullRefresh } from 'vant';
export default {
  name: 'Deal',
  components: { List, PullRefresh },
  created () {
    // component init
    // console.log(123123)
  },
  data () {
    return {
      isLoading: false,
      list: [],
      loading: false,
      finished: false,
      queryParams: {
        page: 1,
        count: 10
      }
    };
  },
  props: {
    request: Function,
    params: Object,
    refresh: Number
  },
  watch: {
    refresh () {
      if (this.refresh != 0) {
        this.onRefresh()
      }
    }
  },
  methods: {
    async onRefresh () {
      this.queryParams.page = 1
      this.isLoading = false;
      this.finished = false;
      /* 这里不知道怎么回事。之前是注释了的 */
      this.onLoad()
    },
    async onLoad () {
      // 异步更新数据
      let tempParams = {
        ...this.queryParams,
        ...this.params
      }
      let res = await this.request(tempParams)
      let data = res.data

      /* 页码为1 */
      if (tempParams.page === 1) {
        this.list = []
      }

      /* 判断两种数据格式 */
      if (data instanceof Array) {

        data.forEach(item => {
          this.list.push(item)
        })

        if (data.length < this.queryParams.count) {
          this.finished = true;
        }
      } else {

        data.list.forEach(item => {
          this.list.push(item)
        })

        if (data.list.length < this.queryParams.count) {
          this.finished = true;
        }

      }

      this.$emit('setData', {
        ...data,
        list: this.list
      })

      // 加载状态结束
      this.loading = false;

      this.queryParams.page += 1

    }
  }
}
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>