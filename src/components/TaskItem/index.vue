<!--
 * @Author: Chenxu
 * @Date: 2020-01-23 21:24:37
 * @LastEditTime: 2020-03-16 22:43:13
 -->
<template>
  <div class="task-item">
    <Card
      @click="showDetail"
      :num="item.num"
      lazy-load
      :price="item.sum_price"
      :title="item.name"
      :thumb="item.image"
    >
      <div slot="desc">
        <p>
          发起人：
          <span class="number">{{item.task_user_username}}</span>
        </p>
        <p>
          任务日期：
          <span class="number">{{item.createtime}}</span>
        </p>
        <p v-if="item.check_info">
          审核反馈：
          <span class="number">{{item.check_info}}</span>
        </p>
        <p>
          价格：
          <span class="number">{{item.price}}</span>
        </p>
      </div>
      <!-- 做条件判断 -->
      <div v-if="item.status_id_text" slot="tags">
        <Tag plain type="danger">{{item.status_id_text}}</Tag>&nbsp;&nbsp;
        <Tag plain type="danger">{{item.level_id_text}}</Tag>
      </div>

      <div slot="footer">
        <template v-if="type=='my'">
          <Tag v-if="Number(item.is_check)" plain type="success">审核通过</Tag>
          <Tag v-else plain type="danger">审核中</Tag>
          <Tag v-if="item.is_del == 1" plain type="danger">任务已取消</Tag>
        </template>
        <!-- <Button
          @click="toCommit"
          v-if="item.type==0&&item.status==0"
          type="primary"
          round
          size="mini"
        >完成</Button>-->
        <!-- <Button v-if="item.type==1&&item.status==1" type="primary" round disabled size="mini">审核中</Button> -->
        <Button
          @click.stop="$emit('cancel')"
          v-if="(item.type==0&&item.status!=2 && item.status!=1) || item.is_del == 0"
          type="danger"
          round
          size="mini"
        >取消任务</Button>
      </div>
    </Card>
    <div class="margin-y"></div>
  </div>
</template>

<script>
import {
  Card,
  Button,
  Tag
} from "vant";
export default {
  name: 'task-item',
  components: {
    Card,
    Button,
    Tag,
  },

  props: ['item', 'type', 'isfabu'],
  methods: {
    showDetail () {
      /* 查看任务订单详情 */
      if (this.type == 'my') {
        this.$router.push({
          name: 'task-committask',
          params: {
            id: this.item.id,
            type: 'info'
          }
        })
      } else {
        this.$router.push({
          name: 'task-committask',
          params: {
            id: this.item.id,
            type: 'order',
            isfabu: this.isfabu
          }
        })
      }

    }
  }
}
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>