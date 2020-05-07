<!--
 * @Auth: Chenxu
 * @Date: 2020-01-17 16:13:54
 * @LastEditTime: 2020-03-15 18:26:17
 -->
<template>
  <div id="TaskAdd">
    <NavBar @click-left="onClickLeft" title="订单录入" />

    <VanCollapse v-model="activeName" accordion>
      <VanCollapseItem title="标题1" :name="0">
        <CellGroup title="基本信息">
          <Field label="任务名称" maxlength="6" v-model="form.name" placeholder="请输入任务名称" />
          <Field
            readonly
            clickable
            label="任务分类"
            :value="value"
            @click="showPicker = true"
            placeholder="请选择任务分类"
          />
          <Field
            readonly
            clickable
            label="任务级别"
            :value="level"
            @click="showPicker1 = true"
            placeholder="请选择任务级别"
          />
          <Field label="悬赏金额" type="number" v-model="form.price" placeholder="请输入悬赏金额" />
          <Field label="数量" type="number" v-model="form.num" placeholder="请输入数量" />
          <Field
            label="任务要求"
            :autosize=" { maxHeight: 150, minHeight: 100 }"
            type="textarea"
            v-model="form.info"
            placeholder="请输入任务要求"
          />
        </CellGroup>

        <CellGroup title="任务图片">
          <Uploader v-model="fileList" multiple :max-count="5" />
        </CellGroup>
      </VanCollapseItem>
    </VanCollapse>

    <div class="margin-y"></div>

    <div class="page-inner-full">
      <Button
        type="info"
        @click="submitBefore"
        :loading="loading"
        :disabled="loading"
        loading-text="提交中..."
        block
      >确定发布</Button>
    </div>

    <!-- fenlei  -->
    <Popup v-model="showPicker" position="bottom">
      <Picker show-toolbar :columns="columns" @cancel="showPicker = false" @confirm="onConfirm" />
    </Popup>
    <!-- jiebie  -->
    <Popup v-model="showPicker1" position="bottom">
      <Picker show-toolbar :columns="columns1" @cancel="showPicker1 = false" @confirm="onConfirm1" />
    </Popup>
  </div>
</template>

<script>
import { renwuStatus, renwuLevel, renwuAdd, upload } from '@/axios/api'
import {
  NavBar,
  Button,
  Field,
  CellGroup,
  Picker,
  Popup,
  Uploader,
  Toast,
  VanCollapseItem,
  VanCollapse
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
    VanCollapseItem,
    VanCollapse
  },
  created () {
    this.getrenwuStatus()
    this.getrenwuLevel()
    /* 是否编辑 */
    if (this.$route.params.id) {
      // this.getGoodsInfo()
    }
  },
  data () {
    return {
      activeName: 0,
      active: 0,
      showPicker: false,
      showPicker1: false,
      columns1: [],
      loading: false,
      ShowPassword: false,
      form: {},
      value: '',
      level: '',
      columns: [],
      fileList: []
    }
  },
  methods: {
    //  methods init 
    async getrenwuStatus () {
      /* 获取任务分类 */
      try {
        let res = await renwuStatus()
        let column = res.data.map(item => ({ text: item.name, value: item.id }))
        this.columns = column
      } catch (error) {
        console.log(error);
      }
    },
    async getrenwuLevel () {
      /* 获取任务等级 */
      try {
        let res = await renwuLevel()
        let column = res.data.map(item => ({ text: item.name, value: item.id }))
        this.columns1 = column
      } catch (error) {
        console.log(error);
      }
    },
    onClickLeft () {
      this.$router.go(-1)
    },
    onConfirm (value) {
      this.value = value.text;
      this.form.status_id = value.value
      this.showPicker = false;
    },
    onConfirm1 (value) {
      this.level = value.text;
      this.form.level_id = value.value
      this.showPicker1 = false;
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