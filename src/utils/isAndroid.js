/*
 * @Author: Chenxu
 * @Date: 2020-03-15 19:27:55
 * @LastEditTime: 2020-03-15 19:31:42
 */
export default function () {
  let u = navigator.userAgent;
  let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
  let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  if (isAndroid) {
    return true;
  } else if (isIOS) {
    return false;
  }
}