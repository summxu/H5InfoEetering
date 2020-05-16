<!--
 * @Auth: Chenxu
 * @Date: 2020-01-17 16:13:54
 * @LastEditTime: 2020-03-15 18:26:17
 -->
<template>
  <div id="TaskAdd">
    <NavBar @click-left="$router.go(-1)" left-arrow left-text="返回" title="订单详情" />
    <CellGroup
      v-for="(element,j) in orderItem.goods_info"
      :key="element.package_id"
      :title="'包裹'+(j+1)"
    >
      <Collapse v-model="activeName" accordion>
        <CollapseItem
          v-for="(item,index) in element.goods"
          :key="index"
          :title="'货物'+(index+1)"
          :name="index"
        >
          <CellGroup>
            <Cell title="条形码" :value="item.goods_code" />
            <Cell :value="item.goods_name" title="货物名称" />
            <Cell title="规格/型号" :value="item.attribute" />
            <Cell title="数量" :value="item.count" />
            <Cell v-if="item.address" title="地址" :value="item.address" />
            <Cell title="单价" :value="item.price">
              <template #right-icon>
                <span>RMB</span>
              </template>
            </Cell>
            <Cell title="货物图片">
              <template #default>
                <VanImage width="50" height="50" :src="item.goods_image" />
              </template>
            </Cell>
          </CellGroup>
        </CollapseItem>
      </Collapse>
    </CellGroup>

    <!-- 物流回显 -->
    <CellGroup v-if="orderItem.express_no" title="物流信息">
      <Cell title="快递单号" type="text" :value="orderItem.express_no" />
    </CellGroup>
    <!-- 收回地址回显 -->
    <CellGroup title="收货信息">
      <Cell title="收货地址" type="text" :value="orderItem.address" />
    </CellGroup>

    <!-- 照片回显 -->
    <CellGroup title="身份信息">
      <Cell title="身份证正面">
        <template #default>
          <VanImage width="50" height="50" :src="baseURL+orderItem.card_front_image" />
        </template>
      </Cell>
    </CellGroup>

    <CellGroup v-if="orderItem.status == 2" title="物流信息">
      <Field clearable label="快递单号" type="text" v-model="wuliu" />
    </CellGroup>
    <p
      v-if="orderItem.status == 2"
      class="alert"
    >{{`* 仓库收货地址：神户市中央区上筒井通4丁目1-11-201。 电话：070-4575-6264 收件人：ズイ（请在括号中备注您的微信号）`}}</p>

    <CellGroup v-if="orderItem.status == 1" title="收货信息">
      <Field clearable label="收货人" type="text" v-model="shouhuo.person" />
      <Field clearable label="手机号" type="text" v-model="shouhuo.phone" />
      <Field clearable label="收货地址" type="text" v-model="shouhuo.address" />
    </CellGroup>

    <CellGroup v-if="orderItem.status == 1" title="身份证正面">
      <Uploader
        @delete="deleteFun"
        :after-read="deleteFun"
        :max-count="1"
        v-model="fileList.card_front_image"
      />
    </CellGroup>

    <div class="margin-y"></div>

    <div v-if=" orderItem.status == 2 " class="page-inner-full">
      <Button
        type="info"
        @click="submit"
        :loading="loading"
        :disabled="loading"
        loading-text="提交中..."
        block
      >确定提交</Button>
    </div>
    <div class="margin-y"></div>
    <div class="margin-y"></div>
    <div class="margin-y"></div>
    <div class="margin-y"></div>
    <div class="margin-y"></div>
    <div class="margin-y"></div>
  </div>
</template>

<script>
import { order, upload, orderAddress, orderExpress } from '@/axios/api'
import { baseURL } from "@/axios/api.js";
import { mapState } from "vuex";
import {
  NavBar,
  Button,
  Cell,
  CellGroup,
  Picker,
  Popup,
  Uploader,
  Toast,
  CollapseItem,
  Collapse,
  Dialog,
  Form,
  Field,
  Image as VanImage
} from 'vant';
export default {
  name: 'TaskAdd',
  components: {
    NavBar,
    Button,
    Cell,
    CellGroup,
    Picker,
    Popup,
    Uploader,
    CollapseItem,
    Collapse,
    Form,
    VanImage,
    Field
  },
  created () {
    this.id = this.$route.params.id
    this.order()
  },
  data () {
    return {
      id: 0,
      activeName: 0,
      active: 0,
      loading: false,
      orderItem: [],
      goods: [],
      options: [],
      tempItem: {},
      fileList: {},
      baseURL: baseURL,
      wuliu: '',
      shouhuo: {
        person: '',
        phone: '',
        address: ''
      }
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    /* 删除函数 */
    deleteFun () {
      this.$forceUpdate()
    },
    //  methods init 
    async order () {
      try {
        let res = await order({ id: this.id })
        if (res.data.status == 1) {
          await this.Alert(res.data.audit_msg)
          this.$router.replace('/')
          throw new Error('订单驳回')
        }
        res.data.goods_info.forEach(item => {
          item.fileList = [{ url: item.goods_image }]
        })
        this.orderItem = res.data
        this.wuliu = res.data.express_no
      } catch (error) {
        console.log(error);
      }
    },
    // 表单提示信息
    Alert (msg) {
      let dialog = Dialog.alert({
        title: '警告',
        message: '您的货物订单被驳回\n' + msg + '\n' + '请重新提交订单',
        confirmButtonText: '确定',
      })
      return dialog
    },
    Alert1 (msg) {
      let dialog = Dialog.alert({
        title: '警告',
        message: '请上传您的身份证信息',
        confirmButtonText: '确定',
      })
      return dialog
    },
    async submit () {
      /* b表单提交 */
      this.loading = true
      try {
        if (this.orderItem.status == 2) {
          // 待发货
          var params = {
            id: this.id,
            express_no: this.wuliu
          }
          var res = await orderExpress(params)
        }
        if (this.orderItem.status == 1) {
          // 实名认证 修改驳回信息的实名认证
          var params = {
            id: this.id,
            address: this.shouhuo.person + '--' + this.shouhuo.phone + '--' + this.shouhuo.address
          }
          if (!this.fileList.card_front_image) {
            await this.Alert1()
            throw new Error('未上传图片')
          }
          // 先上传图片
          var formdata = new FormData();
          formdata.append("image", this.fileList.card_front_image[0].file);
          var res = await upload(formdata)
          params.card_front_image = res.data.upload_path

          var res = await orderAddress(params)
        }
        this.$router.back()
        this.loading = false
        Toast.success(res.msg)
      } catch (error) {
        this.loading = false
        console.log(error);
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>