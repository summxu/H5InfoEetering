<!--
 * @Auth: Chenxu
 * @Date: 2020-01-17 16:13:54
 * @LastEditTime: 2020-03-12 08:46:54
 -->
<template>
  <div id="RealName">
    <NavBar
      left-arrow
      left-text="返回"
      @click-left="onClickLeft"
      :right-text="iframe?'支付完成':''"
      @click-right="getRealName"
      title="实名认证"
    />

    <div class="margin-y"></div>

    <CellGroup>
      <Field label="姓名" type="text" v-model="info.username" placeholder="请输入姓名" />
      <Field label="身份证号" type="text" v-model="info.id_card" placeholder="请输入身份证号" />
      <CellGroup title="身份证正面">
        <Uploader :deletable="!Boolean(info.is_pay)" :max-count="1" v-model="fileList.z_image" />
      </CellGroup>
      <CellGroup title="身份证反面">
        <Uploader :deletable="!Boolean(info.is_pay)" :max-count="1" v-model="fileList.f_image" />
      </CellGroup>
      <CellGroup title="个人照片">
        <Uploader :deletable="!Boolean(info.is_pay)" :max-count="1" v-model="fileList.self_image" />
      </CellGroup>
    </CellGroup>

    <div class="margin-y"></div>

    <!-- <p class="notice">注：实名认证姓名，身份证号码，必须与支付宝一致，如果不同无法收款后果自负！</p> -->

    <div class="margin-y"></div>
    <div class="page-inner-full">
      <Button
        v-if="!info.is_pay"
        type="info"
        :disabled="loading"
        :loading="loading"
        loading-text="提交中..."
        @click="saveInfo"
        block
      >提交认证信息</Button>
      <Button v-if="info.check == '1'&&info.is_pay" type="info" disabled block>审核中</Button>
      <Button v-if="info.check == '2'" type="info" disabled block>认证完成</Button>
      <Button v-if="info.check == '3'" type="danger" disabled block>被拒绝：{{info.info}}</Button>
    </div>

    <!-- 支付ifrem -->
    <iframe v-if="iframe" :src="iframe" frameborder="0" class="iframe-style"></iframe>
  </div>
</template>

<script>
import { setRealName, upload, getRealName } from '@/axios/api'
import { mapState, mapActions, mapMutations } from 'vuex'
import {
  NavBar,
  Button,
  Field,
  CellGroup,
  Cell,
  Toast,
  Dialog,
  Uploader
} from 'vant';
export default {
  name: 'RealName',
  components: {
    NavBar,
    Button,
    Field,
    CellGroup,
    Cell,
    Uploader
  },
  created () {
    // this.getPersonInfo()
    // this.confirm()
    this.getRealName()
    this.info.alipay_account = this.userInfo.mobile
  },
  data () {
    return {
      active: 0,
      loading: false,
      info: {},
      iframe: '',
      fileList: []
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    /* 获取认证信息 */
    async getRealName () {
      this.iframe = ''
      this.info = {}
      this.fileList = {}
      try {
        const { data } = await getRealName()
        /* 支付了才显示 */
        if (!data.is_pay) return false
        this.info = data
        this.fileList.z_image = [{ url: data.z_image }]
        this.fileList.f_image = [{ url: data.f_image }]
        this.fileList.self_image = [{ url: data.self_image }]
      } catch (error) {
        console.log(error)
      }
    },
    /* 保存资料 */
    onClickLeft () {
      this.$router.replace('/person')
    },
    confirm () {
      let dialog = Dialog({
        title: '警告',
        message: '实名认证必须和支付宝收款名字一致，否则后果自负！'
      })
      return dialog
    },
    async uploader () {
      try {
        /* 筛选图片有 file 对象为上传 */
        for (const key in this.fileList) {
          if (this.fileList.hasOwnProperty(key)) {
            const element = this.fileList[key];
            await Promise.all(
              element
                .filter(item => item.file)
                .map(async (item) => {
                  let formdata = new FormData();
                  formdata.append("file", item.file);
                  let res = await upload(formdata)
                  this.info[key] = res.data.url
                })
            )
          }
        }
        return Promise.resolve()
      } catch (error) {
        return Promise.reject('上传文件失败')
      }
    },
    async saveInfo () {
      /* b表单提交 */
      await this.confirm()
      this.loading = true
      try {
        /* 先上传文件 */
        await this.uploader()
        const { data } = await setRealName(this.info)
        /* 刷新下列表 */
        this.getRealName()
        // this.iframe = data
        // window.open(res.data)
        // this.$router.go(-1)
      } catch (error) {
        console.log(error);
      }
      this.loading = false
    }
  }
}
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>