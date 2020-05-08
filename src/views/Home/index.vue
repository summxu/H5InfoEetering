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
            <!-- <Field
              readonly
              clickable
              label="货物模板"
              :value="item.value"
              @click="item.showPicker = true;tempItem = {...item,index}"
              placeholder="可不选择预设模板"
            />-->
            <Field
              :value="item.goods_name"
              :rules="[{ required:true, message: '请输入货物名称' }]"
              label="货物名称"
            >
              <template #input>
                <Select v-model="item.goods_name" filterable placeholder="请选择">
                  <Option
                    v-for="item in goods"
                    :key="item.id"
                    :label="item.text"
                    :value="item.text"
                  ></Option>
                </Select>
              </template>
            </Field>
            <!-- <Field
              label="货物名称"
              clearable
              v-model="item.goods_name"
              :rules="[{ required:true, message: '请输入货物名称' }]"
            />-->
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
import { goodsSearch, orderAdd, upload } from '@/axios/api'
import { Select, Option } from 'element-ui';
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
        showPicker: false
      }],
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
      temp.value = value.text
      temp.showPicker = false
    },
    uploader () {
      let imagesPath = []

      const uploaderQueue = this.itemList.map(element => {
        element.fileList
          // 筛选未上传的
          .filter(item => {
            return item.file // 筛选图片有 file 对象为上传
          })
          // 多个文件用map
          .map(async (item) => {
            let formdata = new FormData();
            formdata.append("image", item.file);
            try {
              const res = await upload(formdata)
              // 图片地址赋值给相应的itemList
              element.upload_path = res.data.upload_path
            } catch (error) {
              console.log(error)
            }
          })
      });
    },
    async submit () {
      /* b表单提交 */
      this.loading = true
      try {
        let params = {

        }
        let res = await orderAdd(params)
        this.loading = false
        this.itemList = [{
          showPicker: false
        }]
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