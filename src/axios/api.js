/*
 * @Author: Chenxu 
 * @Date: 2019-07-04 17:00:12 
 * @Last Modified by: Chenxu
 * @Last Modified time: 2019-12-03 13:34:17
 */
import request from '@/axios/request'
import Axios from "axios";

/* 登录 */
export function pwdLogin (params) {
  return request({
    url: '/api/User/login',
    method: 'POST',
    params
  })
}

export function register (params) {
  return request({
    url: '/api/User/reg',
    method: 'POST',
    params
  })
}