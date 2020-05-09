<!--
 * @Auth: Chenxu
 * @Date: 2020-01-17 16:13:54
 * @LastEditTime: 2020-03-15 18:26:17
 -->
<template>
  <div id="TaskAdd">
    <NavBar title="订单详情" />
    <Collapse v-model="activeName" accordion>
      <CollapseItem
        v-for="(item,index) in itemList"
        :key="index"
        :title="'货物'+(index+1)"
        :name="index"
      >
        <CellGroup title="货物信息">
          <Cell :value="item.goods_name" title="货物名称" />
          <Cell title="规格/型号" :value="item.attribute" />
          <Cell title="数量" :value="item.count" />
          <Cell title="单价" :value="item.price">
            <template #right-icon>
              <span>RMB</span>
            </template>
          </Cell>
        </CellGroup>

        <CellGroup title="货物图片">
          <Uploader :max-count="1" :value="item.fileList" multiple />
        </CellGroup>
      </CollapseItem>
    </Collapse>
    <div class="margin-y"></div>

    <Button
      type="info"
      native-type="submit"
      :loading="loading"
      :disabled="loading"
      loading-text="提交中..."
      block
    >确定发布</Button>
    <div class="margin-y"></div>
    <div class="margin-y"></div>
    <div class="margin-y"></div>
    <div class="margin-y"></div>
    <div class="margin-y"></div>
    <div class="margin-y"></div>
  </div>
</template>

<script>
import { goodsSearch, orderAdd, upload, baseURL } from '@/axios/api'
import { Select, Option } from 'element-ui';
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
  Form
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
    Select,
    Option
  },
  created () {
    this.goodsSearch()
  },
  data () {
    return {
      activeName: 0,
      active: 0,
      loading: false,
      itemList: [{
        goods_image: ''
      }],
      goods: [],
      options: [],
      tempItem: {}
    }
  },
  methods: {
    // 验证不通过且没有展开项给提示
    failed () {
      if (this.activeName === '') {
        this.confirmAlert()
      }
    },
    // 表单提示信息
    confirmAlert () {
      let dialog = Dialog.alert({
        title: '警告',
        message: '您的货物订单里有未填项，请检查',
        confirmButtonText: '确定',
      })
      return dialog
    },
    // 移除提示信息
    confirm () {
      let dialog = Dialog.confirm({
        title: '警告',
        message: '确定要移除当前货物吗，请谨慎操作 ！',
        confirmButtonText: '移除',
        confirmButtonColor: 'red',
        cancelButtonText: '返回',
      })
      return dialog
    },
    // 移除货物
    async delItem (index) {
      try {
        await this.confirm()
        this.itemList.splice(index, 1)
      } catch (error) {
        console.log(error)
      }
    },
    // 增加货物
    addItem () {
      this.itemList.push({ goods_image: '' })
    },
    //  methods init 
    async goodsSearch () {
      try {
        let res = await goodsSearch()
        this.goods = res.data.map(item => ({
          ...item,
          text: item.goods_name
        }))
      } catch (error) {
        console.log(error);
      }
    },
    onFocus (item) {
      this.tempItem = item
      this.options = this.goods
    },
    onChange (val) {
      this.tempItem.goods_name = val
      const tempGood = this.goods.find(item => item.goods_name == val)
      if (tempGood) {
        this.tempItem.text = val
        this.tempItem.price = tempGood.id
        this.tempItem.attribute = tempGood.attribute
        this.tempItem.count = tempGood.count
        if (tempGood.goods_image) {
          this.tempItem.fileList = [{ url: baseURL + tempGood.goods_image }]
        } else {
          this.tempItem.fileList = []
        }
      }
    },
    selectBlur (val) {
      if (val) { //val存在
        this.tempItem.goods_name = val
        this.options = this.goods.filter((item) => item.text.indexOf(val) != -1)
        this.options.unshift({ text: val, value: val })
      } else { //val为空时，还原数组
        this.options = this.goods;
      }
    },
    async submit () {
      /* b表单提交 */
      this.loading = true
      try {

        // 先上传图片
        for (let index = 0; index < this.itemList.length; index++) {
          const element = this.itemList[index];
          if (element.fileList && element.fileList.length) {
            if (element.fileList[0].url) {
              // 有图片直接传图片地址,替换图片地址
              let tempURL = element.fileList[0].url.replace(baseURL, '')
              element.goods_image = element.fileList[0].url
              continue
            }
          }
          let formdata = new FormData();
          formdata.append("image", element.fileList[0].file);
          const res = await upload(formdata)
          // 图片地址赋值给相应的itemList
          console.log(res.data.upload_path)
          element.goods_image = res.data.upload_path
        }

        let goods = this.itemList.map(item => {
          delete item.fileList
          return item
        })
        let params = {
          goods_info: goods
        }
        let res = await orderAdd(params)
        this.loading = false
        this.itemList = [{ goods_image: '' }]
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