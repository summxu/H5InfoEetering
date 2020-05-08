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

// 注册
export function register (params) {
  return request({
    url: '/api/User/reg',
    method: 'POST',
    params
  })
}

// 商品检索列表
export function goodsSearch (params) {
  return request({
    url: '/api/Goods/search',
    method: 'GET',
    params
  })
}

// 客户提交订单接口
export function orderAdd (params) {
  return request({
    url: '/api/Goods/order',
    method: 'POST',
    params
  })
}


// 通用上传
export function upload (params) {
  return request({
    url: '/api/User/upload',
    method: 'POST',
    params
  })
}