<!--
 * @Auth: Chenxu
 * @Date: 2020-01-17 16:13:54
 * @LastEditTime: 2020-03-15 18:26:17
 -->
<template>
  <div id="TaskAdd">
    <NavBar title="订单录入" @click-right="addParce" right-text="增加包裹" />
    <!-- 遮罩 -->
    <Overlay :show="show">
      <div class="wrapper" @click.stop>
        <p class="block-title">请选择运输方式：</p>
        <div class="div">
          <div class="block" @click="setExpress(1)">
            <p class="block-text">海运</p>
          </div>
          <div class="block" @click="setExpress(2)">
            <p class="block-text">空运</p>
          </div>
        </div>
        <div class="notice">
          <!-- <p class="notice-text">海运禁运：啊实打实的阿达阿松大阿松大阿萨大时代啊</p> -->
          <!-- <p class="notice-text">空运禁运：啊实打实的阿达阿松大阿松大阿萨大时代啊</p> -->
        </div>
      </div>
    </Overlay>

    <Form @submit="submit" @failed="failed">
      <CellGroup :border="true" v-for="(element,j) in parcelList" :key="j">
        <template #title>
          <span class="group-title">包裹{{j+1}}</span>
          <span class="red title-right">毛重（含纸箱）不得超过3kg</span>
          <div class="group-header">
            <Button
              style="border:none;height:20px"
              text="增加货物"
              native-type="button"
              size="small"
              @click="addItem(j)"
              plain
              round
            />
            <Button
              style="border:none;color:red;height:20px"
              text="移除包裹"
              native-type="button"
              size="small"
              @click.stop="delParcel(j)"
              plain
              round
            />
          </div>
        </template>
        <Collapse v-model="element.activeName" accordion>
          <CollapseItem
            v-for="(item,index) in parcelList[j].itemList"
            :key="index"
            :title="'货物'+(index+1)"
            :name="index"
          >
            <!-- 右侧按钮 -->
            <template #value>
              <Button
                style="border:none;color:red;height:20px"
                native-type="button"
                text="移除"
                size="small"
                @click.stop="delItem(j,index)"
                plain
                round
              />
            </template>
            <CellGroup>
              <Field
                :value="item.goods_name"
                :rules="[{ required:true, message: '请输入货物名称' }]"
                label="货物名称"
              >
                <template #input>
                  <i-select
                    @on-open-change="onFocus($event,item)"
                    @on-change="onChange"
                    remote
                    filterable
                    :remote-method="selectBlur"
                    v-model="item.goods_name"
                  >
                    <i-option
                      v-for="item in options"
                      :value="item.text"
                      :key="item.text"
                      :label="item.text"
                    >{{ item.text }}</i-option>
                  </i-select>
                </template>
              </Field>

              <Field
                @blur="deleteFun"
                clearable
                label="规格/型号"
                type="text"
                v-model="item.attribute"
                :rules="[{ required:true, message: '请输入规格/型号' }]"
              />
              <Field
                clearable
                @blur="deleteFun"
                label="数量"
                type="number"
                v-model="item.count"
                :rules="[{ required:true, message: '请输入数量' }]"
              />
              <Field
                clearable
                @blur="deleteFun"
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

            <CellGroup title="货物图片（注：可不填写）">
              <Uploader
                @delete="deleteFun"
                :after-read="deleteFun"
                :max-count="1"
                v-model="item.fileList"
                multiple
              />
            </CellGroup>
          </CollapseItem>
        </Collapse>
      </CellGroup>

      <CellGroup title="收货信息">
        <Field
          clearable
          label="收货人"
          type="text"
          :rules="[{ required:true, message: '请输入收货人' }]"
          v-model="shouhuo.person"
        />
        <Field
          clearable
          label="手机号"
          type="number"
          :rules="[{ required:true, message: '请输入手机号' }]"
          :maxlength="11"
          v-model="shouhuo.phone"
        />
        <Field
          clearable
          label="收货地址"
          type="text"
          :rules="[{ required:true, message: '请输入收货地址' }]"
          v-model="shouhuo.address"
        />
        <Field
          clearable
          label="身份证号码"
          type="text"
          :rules="[{ required:true, message: '请输入身份证号码' }]"
          v-model="card_code"
        />
      </CellGroup>

      <CellGroup title="身份证正面">
        <Uploader
          @delete="deleteFun"
          :after-read="deleteFun"
          :max-count="1"
          v-model="card_front_image"
        />
      </CellGroup>

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
import { goodsSearch, orderAdd, upload, baseURL } from '@/axios/api'
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
  Form,
  Overlay
} from 'vant';
export default {
  name: 'TaskAdd',
  components: {
    NavBar,
    Button,
    Field,
    CellGroup,
    Picker,
    Popup,
    Uploader,
    CollapseItem,
    Collapse,
    Form,
    Select,
    Option,
    Overlay
  },
  created () {
    this.goodsSearch()
  },
  data () {
    return {
      show: true,
      express_type: 1, // 1海运2空运
      active: 0,
      loading: false,
      card_code: '',
      shouhuo: {
        person: '',
        phone: '',
        address: '',
      },
      card_front_image: [],
      parcelList: [{
        activeName: 0,
        itemList: [{
          goods_image: '',
          fileList: []
        }],
      }],
      itemList: [{
        goods_image: '',
        fileList: []
      }],
      goods: [],
      options: [],
      tempItem: {}
    }
  },
  methods: {
    // 设置运输方式
    setExpress (type) {
      this.show = false
      this.express_type = type
    },
    /* 删除函数 */
    deleteFun () {
      this.$forceUpdate()
    },
    // 验证不通过且没有展开项给提示
    failed () {
      this.confirmAlert()
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
    confirm (name) {
      let dialog = Dialog.confirm({
        title: '警告',
        message: `确定要移除当前${name}吗，请谨慎操作 ！`,
        confirmButtonText: '移除',
        confirmButtonColor: 'red',
        cancelButtonText: '返回',
      })
      return dialog
    },
    // 移除包裹
    async delParcel (j) {
      try {
        await this.confirm('包裹')
        this.parcelList.splice(j, 1)
      } catch (error) {
        console.log(error)
      }
    },
    // 移除货物
    async delItem (j, index) {
      try {
        await this.confirm('货物')
        this.parcelList[j].itemList.splice(index, 1)
      } catch (error) {
        console.log(error)
      }
    },
    // 增加包裹
    addParce () {
      this.parcelList.push({
        itemList: [{
          goods_image: '',
          fileList: []
        }]
      })
    },
    // 增加货物
    addItem (j) {
      this.parcelList[j].itemList.push({ goods_image: '' })
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

    onFocus (is, item) {
      if (is) {
        this.options = this.goods
        this.tempItem = item
      }
    },
    onChange (val) {
      this.tempItem.goods_name = val
      const tempGood = this.goods.find(item => item.goods_name == val)
      if (tempGood) {
        this.tempItem.text = val
        this.tempItem.price = tempGood.price
        this.tempItem.attribute = tempGood.attribute
        // this.tempItem.count = tempGood.count
        if (tempGood.goods_image) {
          this.tempItem.fileList = [{ url: baseURL + tempGood.goods_image }]
        } else {
          this.tempItem.fileList = []
        }
        this.$forceUpdate()
      }
    },
    selectBlur (val) {
      if (val) { //val存在
        this.options = this.goods.filter((item) => item.text.indexOf(val) != -1)
        if (!this.options.length) {
          this.options.unshift({ text: val, value: val })
          this.$forceUpdate()
        }
      } else { //val为空时，还原数组
        this.options = this.goods;
      }
    },
    async submit () {
      /* b表单提交 */
      this.loading = true
      try {

        // 先上传图片
        for (let j = 0; j < this.parcelList.length; j++) {
          const item = this.parcelList[j];
          for (let index = 0; index < item.itemList.length; index++) {
            const element = item.itemList[index];
            if (element.fileList && element.fileList.length) {
              if (element.fileList[0].url) {
                // 有图片直接传图片地址,替换图片地址
                let tempURL = element.fileList[0].url.replace(baseURL, ' ')
                element.goods_image = tempURL
                continue
              }
              console.log(element)
              let formdata = new FormData();
              formdata.append("image", element.fileList[0].file);
              const res = await upload(formdata)
              // 图片地址赋值给相应的itemList
              console.log(res.data.upload_path)
              element.goods_image = res.data.upload_path
            }
          }
        }


        let goods = this.parcelList.map(item => {
          return item.itemList.map(element => {
            delete element.fileList
            delete element.text
            return element
          })
        })
        let params = {
          card_code: this.card_code,
          express_type: this.express_type,
          goods_info: goods,
          card_front_image: '',
          address: this.shouhuo.person + ' ' + this.shouhuo.phone + ' ' + this.shouhuo.address
        }

        if (this.card_front_image.length) {
          // 先上传省份证
          var formdata = new FormData();
          formdata.append("image", this.card_front_image[0].file);
          var res = await upload(formdata)
          params.card_front_image = res.data.upload_path
        }


        var res = await orderAdd(params)
        this.loading = false
        this.parcelList = [{
          activeName: 0,
          itemList: [{
            goods_image: '',
            fileList: []
          }],
        }]
        this.$router.push('order')
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