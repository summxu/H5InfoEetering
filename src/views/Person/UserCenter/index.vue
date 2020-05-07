<!--
 * @Auth: Chenxu
 * @Date: 2020-01-17 16:13:54
 * @LastEditTime : 2020-02-02 20:46:52
 -->
<template>
  <div id="UserCenter">
    <!-- 文件上传组件 -->
    <input style="display:none" type="file" id="inputer" ref="inputer" @change="fileUpload" />
    <!-- 遮罩 -->
    <Overlay :z-index="99" :show="loading">
      <div class="wrapper" @click.stop>
        <div class="block">
          <Loading color="#fff" size="24px">上传中...</Loading>
        </div>
      </div>
    </Overlay>

    <NavBar
      left-arrow
      left-text="返回"
      @click-left="onClickLeft"
      title="修改个人资料"
      right-text="保存"
      @click-right="saveInfo"
    />

    <CellGroup title="个人资料">
      <Cell @click="activeFileUpload" class="avatar" center title="用户头像" is-link>
        <van-image round v-if="userInfo.avatar" :src="userInfo.avatar" alt />
        <van-image round v-else :src="require('@/assets/person/defaultImg.jpg')" alt />
        <!-- <Uploader v-model="fileList" /> -->
      </Cell>
      <Field
        input-align="right"
        label="用户名"
        type="text"
        v-model="userInfo.username"
        placeholder="请输入用户名称"
      />
      <Field
        input-align="right"
        label="用户昵称"
        type="text"
        v-model="userInfo.nickname"
        placeholder="请输入用户昵称"
      />
      <Field
        input-align="right"
        label="个人简介"
        :autosize=" { maxHeight: 150, minHeight: 100 }"
        type="textarea"
        v-model="userInfo.bio"
        placeholder="请输入个人简介"
      />
    </CellGroup>

    <div class="margin-y"></div>

    <div class="page-inner-full">
      <!-- <Button type="info" @click="logOut" block>修改密码</Button> -->
      <!-- <div class="margin-y"></div> -->
      <Button type="info" @click="setPayPass" block>修改交易密码</Button>
      <div class="margin-y"></div>
      <Button type="danger" @click="logOut" block>退出登录</Button>
    </div>
  </div>
</template>

<script>
import { upload, setProfile } from '@/axios/api'
import { mapState, mapActions, mapMutations } from 'vuex'
import {
  NavBar,
  Button,
  Field,
  CellGroup,
  Picker,
  Popup,
  Uploader,
  Cell,
  Toast,
  Overlay,
  Loading
} from 'vant';
export default {
  name: 'UserCenter',
  components: {
    NavBar,
    Button,
    Field,
    CellGroup,
    Picker,
    Popup,
    Uploader,
    Cell,
    Overlay,
    Loading
  },
  created () {
    this.getPersonInfo()
  },
  computed: {
    ...mapState(['userInfo'])
  },
  data () {
    return {
      active: 0,
      loading: false,
      avatar: ''
    }
  },
  methods: {
    ...mapActions(['logOut']),
    ...mapActions(['getPersonInfo']),
    /* 保存资料 */
    onClickLeft () {
      this.$router.go(-1)
    },
    activeFileUpload () {
      let inputer = window.document.getElementById('inputer')
      inputer.click()
    },
    async fileUpload (e) {
      this.loading = true
      try {
        let file = event.target.files
        let formData = new FormData()
        formData.append('file', file[0])
        let res = await upload(formData)
        this.userInfo.avatar = res.data.url
      } catch (error) {
        console.log(error);
      }
      this.loading = false

    },
    async setPayPass () {
      this.$router.push({
        name: 'login',
        params: {
          type: 'paypass'
        }
      })
    },
    async saveInfo () {
      /* b表单提交 */
      this.loading = true
      try {
        let params = {
          username: this.userInfo.username,
          nickname: this.userInfo.nickname,
          avatar: this.userInfo.avatar,
          bio: this.userInfo.bio
        }
        let res = await setProfile(params)
        this.$router.go(-1)
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