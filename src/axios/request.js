/*
 * @Auth: Chenxu
 * @Date: 2019-12-26 13:07:13
 * @LastEditTime : 2020-02-14 16:38:26
 */
import axios from 'axios'
import { Toast } from 'vant';
import router from "@/router/index";
import store from "@/store";

const service = axios.create({
  baseURL: 'http://wxshop.aiquanyouxuan.vip',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 50000
})

service.interceptors.request.use(
  config => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    /* 登陆状态 */
    if (userInfo) {
      config.headers['token'] = userInfo.token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const res = response.data

    if (!res.code) {
      Toast.fail(res.msg)
      return Promise.reject(res.msg || 'Error')
    } else {
      return res
    }
  },
  error => {
    switch (error.response.status) {
      case 401:
        Toast.fail('用户信息获取失败,请重新登录!')

        store.dispatch('logOut')
        router.push('/login')

        return Promise.reject(error)
      default:
        Toast.fail('服务器开小差了┭┮﹏┭┮')
        return Promise.reject(error)
    }
  }
)

export default service