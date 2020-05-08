<!--
 * @Auth: Chenxu
 * @Date: 2020-01-17 16:13:54
 * @LastEditTime: 2020-03-15 18:26:17
 -->
<template>
  <div id="TaskAdd">
    <NavBar title="订单录入" @click-right="addItem" right-text="增加货物" />
    <Form @submit="submit" @failed="failed">
      <Collapse v-model="activeName" accordion>
        <CollapseItem
          v-for="(item,index) in itemList"
          :key="index"
          :title="'货物'+(index+1)"
          :name="index"
        >
          <!-- 右侧按钮 -->
          <template #value>
            <Button
              style="border:none;color:red;height:20px"
              text="移除"
              size="small"
              @click.stop="delItem(index)"
              plain
              round
            />
          </template>
          <CellGroup title="货物信息">
            <Field
              readonly
              clickable
              label="货物模板"
              :value="value"
              @click="item.showPicker = true;tempItem = {...item,index}"
              placeholder="可不选择预设模板"
            />
            <Field
              label="货物名称"
              clearable
              v-model="item.goods_name"
              :rules="[{ required:true, message: '请输入货物名称' }]"
            />
            <Field
              clearable
              label="规格/型号"
              type="text"
              v-model="item.option"
              :rules="[{ required:true, message: '请输入规格/型号' }]"
            />
            <Field
              clearable
              label="数量"
              type="number"
              v-model="item.num"
              :rules="[{ required:true, message: '请输入数量' }]"
            />
            <Field
              clearable
              label="单价"
              type="number"
              v-model="item.price"
              :rules="[{ required:true, message: '请输入单价' }]"
            >
              <template #right-icon>
                <span>RMB</span>
              </template>
            </Field>
          </CellGroup>

          <CellGroup title="货物图片">
            <Uploader v-model="item.fileList" multiple :max-count="5" />
          </CellGroup>

          <!-- goods -->
          <Popup v-model="item.showPicker" position="bottom">
            <Picker
              show-toolbar
              :columns="goods"
              @cancel="item.showPicker = false"
              @confirm="onConfirm"
            />
          </Popup>
        </CollapseItem>
      </Collapse>
      <div class="margin-y"></div>

      <div class="page-inner-full">
        <Button
          type="info"
          native-type="submit"
          :loading="loading"
          :disabled="loading"
          loading-text="提交中..."
          block
        >确定发布</Button>
      </div>
    </Form>
    <div class="margin-y"></div>
    <div class="margin-y"></div>
    <div class="margin-y"></div>
    <div class="margin-y"></div>
    <div class="margin-y"></div>
    <div class="margin-y"></div>
  </div>
</template>

<script>
import { goodsSearch, renwuAdd, upload } from '@/axios/api'
import {
  NavBar,
  Button,
  Field,
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
import ShowPassword from "@/components/ShowPassword";
export default {
  name: 'TaskAdd',
  components: {
    NavBar,
    Button,
    Field,
    CellGroup,
    ShowPassword,
    Picker,
    Popup,
    Uploader,
    CollapseItem,
    Collapse,
    Form
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
        showPicker: false
      }],
      value: '',
      goods: [],
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
      this.itemList.push({
        showPicker: false
      })
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
    onConfirm (value) {
      // 找到itemList
      var temp = this.itemList.find((item, index) => index === this.tempItem.index)
      // 带入预设数据
      temp.goods_name = value.goods_name
      temp.price = value.price
      temp.showPicker = false
    },
    async uploader () {
      let imagesPath = []
      /* 筛选图片有 file 对象为上传 */
      let uploaderQueue =
        this.fileList
          .filter(item => {
            return item.file
          })
          .map((item) => {
            let formdata = new FormData();
            formdata.append("file", item.file);
            return upload(formdata)
          })
      return await Promise.all(uploaderQueue)
    },
    submitBefore () {
      /* 表单验证 */
      if (this.form.num <= 0) {
        Toast('数量不能小于1')
        return false
      }
      this.ShowPassword = true
    },
    async submit (pay_password) {
      console.log(123123123123)
      /* b表单提交 */
      this.ShowPassword = false
      this.loading = true
      try {
        let imagesPath = await this.uploader()
        imagesPath = imagesPath.map(item => (
          item.data.url
        ))
        /* 新增和编辑的图片结合 */
        let olgImagePath =
          this.fileList
            .filter(item => item.url)
            .map(item => item.url)
        let sumImagesPath = [...olgImagePath, ...imagesPath]
        // console.log(olgImagePath, imagesPath, sumImagesPath);
        let params = {
          ...this.form,
          image: sumImagesPath.toString(),
          id: this.$route.params.id,
          pay_password
        }
        let res = await renwuAdd(params)
        this.loading = false
        this.$router.go(-1)
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