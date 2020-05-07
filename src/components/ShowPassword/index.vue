<!--
 * @Author: Chenxu
 * @Date: 2020-01-23 21:24:37
 * @LastEditTime : 2020-02-10 11:29:55
 -->
<template>
  <div id="ShowPassword">
    <Overlay z-index="99" :show="showKeyboard">
      <p class="title">请输入交易密码</p>
      <!-- 密码输入框 -->
      <PasswordInput
        class="pwd-input"
        :value="password"
        info="密码为 6 位数字"
        :error-info="errorInfo"
        :focused="showKeyboard"
        @focus="showKeyboard = true"
      />
      <!-- 数字键盘 -->
      <NumberKeyboard
        @input="onInput"
        v-model="password"
        :show="showKeyboard"
        @blur="$emit('close')"
      />
    </Overlay>
  </div>
</template>

<script>
import {
  PasswordInput,
  NumberKeyboard,
  Overlay,
  Toast
} from "vant";
import { checkPassword } from "@/axios/api.js";
import { mapState, mapActions } from "vuex";
export default {
  name: 'ShowPassword',
  components: {
    PasswordInput,
    NumberKeyboard,
    Overlay
  },
  computed: {
    ...mapState(['userInfo'])
  },
  created () {
    if (this.userInfo.pay_password == '') {
      this.$router.push({
        name: 'login',
        params: {
          type: 'paypass'
        }
      })
      Toast('请先设置支付密码！')
    }
    console.log()
  },
  data () {
    return {
      password: '',
      showKeyboard: true,
      errorInfo: ''
    }
  },
  methods: {
    ...mapActions(['getPersonInfo']),
    async onInput (key) {
      this.password = (this.password + key).slice(0, 6);
      if (this.password.length === 6) {
        try {
          let params = {
            pay_password: this.password
          }
          let res = await checkPassword(params)

          if (res.code === 3) {
            this.errorInfo = '密码错误,重新输入';
            this.password = ''
          } else {
            this.$emit('over', this.password)
          }

        } catch (error) {
          console.log(error);
        }
      } else {
        this.errorInfo = '';
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>