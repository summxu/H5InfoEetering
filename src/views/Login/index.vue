<!--
 * @Author: Chenxu
 * @Date: 2020-01-26 19:26:11
 * @LastEditTime: 2020-03-16 23:09:18
 -->
<template>
  <div id="login">
    <NavBar
      v-if="$route.params.type == 'paypass'"
      left-arrow
      left-text="返回"
      @click-left="onClickLeft"
      title="修改交易密码"
    />
    <div class="loginBox" @click="changeImage(3)">
      <div class="auth-form">
        <div class="panfish">
          <img :src="imageURL" alt />
        </div>
        <Tabs v-model="active" @change="clearSmsCaptcha" animated>
          <!-- 手机号密码登录 -->
          <Tab
            v-if="$route.params.type != 'paypass' && $route.query.type != '1'"
            :title="$t('login.title')"
          >
            <CellGroup v-show="!isShowSMSLogin">
              <Field
                v-model="login_userName"
                type="text"
                required
                :maxlength="11"
                label="手机号"
                placeholder="请输入登录手机号"
              />
              <Field
                v-model="login_password"
                type="password"
                :label="$t('login.pass')"
                :placeholder="$t('login.passTip')"
                required
                @click.stop="changeImage(1)"
                autocomplete
              />
            </CellGroup>
            <Button type="info" style="margin-top:1rem" block @click="login">{{$t('login.login')}}</Button>
            <!-- <div
              class="switchLogin"
              @click="switchLogin"
            >{{this.isShowSMSLogin?$t('login.phoneVerify'):$t('login.smsMessage')}}</div>-->
          </Tab>
          <!-- 注册 -->
          <Tab v-if="$route.params.type != 'paypass' " :title="$t('login.resgin')">
            <CellGroup>
              <Field
                v-model="register_userName"
                maxlength="11"
                :label="$t('login.phoneNumber')"
                :placeholder="$t('login.phoneInput')"
                required
              />
              <Field
                v-model="register_pwd"
                type="password"
                @click.stop="changeImage(1)"
                :label="$t('login.pass')"
                :placeholder="$t('login.passTip2')"
                required
              />
              <Field
                v-model="confirm_password"
                type="password"
                @click.stop="changeImage(1)"
                label="确认密码"
                :maxlength="6"
                placeholder="输入确认密码"
                required
              />
            </CellGroup>
            <Button
              type="info"
              style="margin-top:1rem"
              block
              @click="registerFun"
            >{{$t('login.resgin')}}</Button>
          </Tab>
        </Tabs>

        <!-- 底部声明 -->
        <!-- <p class="agreement">
          {{$t('login.tipTile')}}
          <br />
          {{$t('login.tipContent')}}
          <a
            @click.stop="agreement(0)"
            class="agreement-box"
          >{{$t('login.tip')}}</a>、
          <a @click.stop="agreement(1)" class="agreement-box">{{$t('login.tipProcy')}}</a>
        </p>-->
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
// 引入Vant的组件
import {  Toast, Dialog, Tabs, Tab, Icon,
  CellGroup, Divider, Field, NavBar, Button, Grid, GridItem} from 'vant'
// 引入API调用接口
import { register, pwdLogin } from '@/axios/api.js'
// 引入vuex
import { mapState, mapActions, mapMutations } from 'vuex'
import isAndroid from "@/utils/isAndroid.js";
export default {
  name: 'Login',
  components: {    Tabs, Tab, Icon, NavBar,
    CellGroup, Field, Divider, Button, Grid, GridItem  },
  data () {
    return {
      countDown: 0,                 // 倒计时
      active: 0,
      login_userName: '',            // 用户名
      login_password: '',           // 用户密码
      login_phone: '',              // 手机号码
      register_userName: '',        // 注册用户名
      register_pwd: '',             // 注册密码
      confirm_password: '',
      register_up_id: '',             // 上级id
      register_sms_captcha: '',             // 注册验证码
      imgCaptcha: '',               // 图片验证码
      smsCaptcha: '',               // 短信验证码
      isShowSMSLogin: false,         // 是否短信登录
      switchLoginMsg: this.$t('login.switchLoginMsg'),
      imageURL: require('@/assets/login/normal.png'),
      smsCaptchaResult: null,
      userInfo: null
    };
  },
  computed: {
    ...mapState({ userInfoVuex: 'userInfo' }),
    // 1.手机号码验证
    phoneNumberRight () {
      let value = this.isShowSMSLogin ? this.login_phone : this.login_userName;
      // 1.1 当输入的手机号大于10位进行验证
      return true;
    },
    // 2.发送验证码按钮显示
    captchaDisable () {
      return false;
    }
  },
  created () {
    if (this.$route.query.type == 1) {
      // this.active = 1
      this.register_up_id = this.$route.query.up_id
    }
  },
  beforeDestroy () {
    this.getPersonInfo()
  },
  methods: {
    // 0.mapActions 同步用户信息
    ...mapActions(['getPersonInfo']),
    ...mapActions(['syncUserInfo']),
    // 1.手机号密码登录及短信验证码切换
    switchLogin () {
      this.isShowSMSLogin = !this.isShowSMSLogin;
    },
    // 2.切换萌猫图片
    changeImage (index) {
      if (index == 0) {
        this.imageURL = require('@/assets/login/greeting.png')
      } else if (index == 1) {
        this.imageURL = require('@/assets/login/blindfold.png')
      } else {
        this.imageURL = require('@/assets/login/normal.png')
      }
    },
    // 3.手机号密码登录切换图片验证码
    getCaptcha () {
      // 获取验证码的标签
      let captchaEle = this.$refs.imgCaptcha;
      this.$set(captchaEle, 'src', 'http://demo.itlike.com/web/xlmc/api/captcha?time=' + new Date());
    },
    // 4.获取手机验证码
    async sendVerifyCode (type) {
      this.countDown = 60;
      this.timeIntervalID = setInterval(() => {
        this.countDown--;
        // 4.1 如果减到0 则清除定时器
        if (this.countDown == 0) {
          clearInterval(this.timeIntervalID);
        }
      }, 1000)
      // 4.2 获取短信验证码
      try {
        let params = {
          event: type === "paypass" ? 'resetpwd' : type
        }
        switch (type) {
          case 'register':
            params.account = this.register_userName
            break;
          case 'paypass':
            params.account = this.userInfoVuex.mobile
            break;
          default:
            params.account = this.login_userName
            break;
        }
        let result = await getPhoneCaptcha(params);
        if (result.success_code == 200) {
          this.smsCaptchaResult = result.data.code;
          // 4.3  获取验证码成功
          Dialog.alert({
            title: this.$t('login.tipTile'),
            message: this.$t('login.message') + result.data.code
          }).then(() => {
          });
        }
      } catch (error) {
        this.countDown = 1
        console.log(error);
      }

    },
    onClickLeft () {
      this.$router.go(-1)
    },
    // 5.登录
    async login () {
      // 5.2 手机号密码登录
      // 5.2.1 验证输入框
      if (this.login_userName.length < 1) {
        Toast({
          message: '手机号不能为空!',
          duration: 800
        });
        return;
      } else if (this.login_password.length < 1) {
        Toast({
          message: "密码不能为空",
          duration: 800
        });
        return;
      }
      try {
        // 5.2.2 请求后台
        let ref = await pwdLogin({
          account: this.login_userName,
          password: this.login_password,
        });
        this.syncUserInfo(ref.data);
        // this.$router.back();
        this.$router.replace('/home')
      } catch (error) {
        console.log(error);
      }
    },
    /* 加载提示信息 */
    confirm () {
      let dialog = Dialog.confirm({
        title: '警告',
        message: '注册手机号默认支付宝收款帐号，请谨慎注册 ！',
        confirmButtonText: '确认注册',
        cancelButtonText: '返回',
      })
      return dialog
    },
    clearSmsCaptcha () {
      this.smsCaptcha = ''
      this.countDown = 0
      clearInterval(this.timeIntervalID);
    },
    // 6.注册
    async registerFun () {
      if (this.register_userName.length < 1) {
        Toast({
          message: this.$t('login.phoneNumberNotEmpty'),
          duration: 800
        })
      } else if (!this.phoneRegex(this.register_userName)) {
        Toast({
          message: this.$t('login.phoneNumberNotCorrect'),
          duration: 800
        })
      } else if (this.register_pwd.length < 0) {
        Toast({
          message: this.$t('login.passTip'),
          duration: 800
        })
      } else if (this.register_pwd.length < 6) {
        Toast({
          message: this.$t('login.passTip2'),
          duration: 800
        })
      } else if (this.confirm_password != this.register_pwd) {
        Toast({
          message: '两次密码输入不一致',
          duration: 800
        })
      } else {
        try {
          let ref = await register({
            account: this.register_userName,
            password: this.register_pwd,
            confirm_password: this.confirm_password,
          });
          // 设置userInfo 保存到vuex和本地
          // this.syncUserInfo(ref.data);
          // this.$router.back();
          Toast({
            message: '注册成功！',
            duration: 800
          })
          this.active = 0
          this.smsCaptcha = ''
          this.countDown = 0
          if (this.register_up_id) {
            /* 这里安卓得跳转下载链接 */
            if (isAndroid()) {
              location.href = 'https://copy.im/a/w6ZxBK'
            }
            this.$router.replace('/home')
          }
          clearInterval(this.timeIntervalID);
        } catch (error) {
          console.log(error);
        }
      }
    },
    /* 修改交易面膜 */
    async setPayPass () {
      if (this.login_password.length < 0) {
        Toast({
          message: '交易密码不能为空',
          duration: 800
        })
      } else if (this.login_password.length < 6) {
        Toast({
          message: '交易密码至少6位',
          duration: 800
        })
      } else if (!(/^\d+$/.test(this.login_password))) {
        Toast({
          message: '交易密码只能是整数',
          duration: 800
        })
      } else if (this.smsCaptcha.length < 1) {
        Toast({
          message: '请输入验证码',
          duration: 800
        });
        return;
      }
      try {
        // 5.2.2 请求后台
        let ref = await payPwd({
          newpassword: this.login_password,
          captcha: this.smsCaptcha
        });
        // this.syncUserInfo(ref.data);
        this.$router.back();
        Toast.success(res.msg)
        // this.active = 0
        this.active = 0
        this.smsCaptcha = ''
        this.countDown = 0
        clearInterval(this.timeIntervalID);
      } catch (error) {
        console.log(error);
      }
    },
    /* 忘记密码 */
    async forget () {
      if (this.login_userName.length < 1) {
        Toast({
          message: '手机号不能为空!',
          duration: 800
        });
        return;
      } else if (this.login_password.length < 1) {
        Toast({
          message: "密码不能为空",
          duration: 800
        });
        return;
      } else if (this.smsCaptcha.length < 1) {
        Toast({
          message: '请输入验证码',
          duration: 800
        });
        return;
      }
      try {
        // 5.2.2 请求后台
        let ref = await resetPwd({
          mobile: this.login_userName,
          newpassword: this.login_password,
          captcha: this.smsCaptcha
        });
        // this.syncUserInfo(ref.data);
        // this.$router.back();
        this.active = 0
        this.smsCaptcha = ''
        this.countDown = 0
        clearInterval(this.timeIntervalID);
        Toast.success(res.msg)

        // this.$router.replace('/home')
      } catch (error) {
        console.log(error);
      }
    },


    // 7.用户协议
    agreement (index) {
      if (index == 0) {
        Toast({
          message: this.$t('login.tip'),
          duration: 800
        })
      } else {
        Toast({
          message: this.$t('login.tipProcy'),
          duration: 800
        })
      }
    },
    // 8.关闭
    close () {
      this.$router.back();
    },
    // 9.第三方登录
    thirdLogin (value) {
      if (value == 0) {
        Toast({
          message: this.$t('login.otherWechat'),
          duration: 800
        });
      } else {
        Toast({
          message: this.$t('login.otherQQ'),
          duration: 800
        });
      }
    },
    // 正则验证
    phoneRegex (number) {
      return (/[1][3,4,5,6,7,8][0-9]{9}$/.test(number));
    }
  }
}
</script>
<style lang="less" scoped>
#login {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("../../assets/login/loginbg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-attachment: fixed;

  .van-field__label {
    width: 50px;
  }

  .loginBox {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    opacity: 0.95;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
    .auth-form {
      position: relative;
      padding: 1rem;
      padding-top: 2rem;
      width: 26.5rem;
      max-width: 90%;
      font-size: 1.167rem;
      background-color: #fff;
      border-radius: 8px;
      box-sizing: border-box;
    }
    img {
      position: absolute;
      top: 1rem;
      left: 50%;
      width: 4rem;
      transform: translate(-50%, -70%);
      z-index: 1;
      @media screen and (max-width: 320px) {
        top: 0.5rem;
        transform: translate(-50%, -40%);
        width: 5rem;
      }
    }
    .closeButton {
      position: absolute;
      right: 1rem;
      top: 0.4rem;
    }
    .verificationImage {
      position: absolute;
      right: 0;
      width: 8rem;
      height: 3rem;
      margin-left: 3rem;
    }
    .switchLogin {
      margin-top: 1rem;
      font-size: 0.78rem;
    }
  }
}
.title {
  padding: 0.5rem;
  font-size: 0.5rem;
  color: grey;
}
.agreement {
  // margin-top: 1.667rem;
  line-height: 1rem;
  color: #767676;
  font-size: 0.867rem;
  .agreement-box {
    color: blue;
  }
}
</style>