/*
 * @Auth: Chenxu
 * @Date: 2019-12-30 10:15:29
 * @LastEditTime: 2020-03-14 10:04:33
 */
import { Plugins } from '@capacitor/core';
const { App, Toast } = Plugins;

var timer = null
const checkTimeOut = () => {
  timer = setTimeout(() => {
    clearTimeout(timer)
    timer = null
  }, 3000);
  return timer
}

const isBack = () => {
  switch (window.location.pathname) {
    case '/home':
      return true
    case '/trade':
      return true
    case '/shop':
      return true
    case '/task':
      return true
    case '/person':
      return true
    default:
      return false
  }
}

/* 安卓返回键 */
App.addListener('backButton', () => {
  if (isBack()) {

    if (timer) {
      App.exitApp()
    } else {
      checkTimeOut()
      Toast.show({
        text: '再按一次退出应用!'
      });
    }
  }
});