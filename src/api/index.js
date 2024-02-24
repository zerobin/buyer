/*
 * @Date: 2023-11-19 13:06:02
 * @LastEditors: 庄鸿斌
 * @LastEditTime: 2024-01-06 23:50:47
 */
import request, { Method } from "@/plugins/request.js";

// 获取首页楼层装修数据
export function indexData(params) {
  return request({
    url: "/public/c/category/list",
    method: Method.POST,
    // needToken: true,
    params,
  });
}

// 获取自动发券
export function getAutoCoup() {
  return request({
    url: "/buyer/promotion/coupon/activity",
    method: Method.GET,
    needToken: true,
  });
}

/**
 * 获取店铺楼层数据
 */
export function getFloorStoreData(params) {
  return request({
    url: `/buyer/other/pageData?pageClientType=PC`,
    method: "get",
    params,
  });
}

/**
 * 楼层装修数据
 * @param pageClientType 客户端类型,可用值:PC,H5,WECHAT_MP,APP
 * @param pageType 页面类型,可用值:INDEX,STORE,SPECIAL
 */
export function pageData(params) {
  return request({
    url: `/buyer/other/pageData`,
    method: Method.GET,
    needToken: false,
    params,
  });
}

/**
 * 刷新token
 */
export function handleRefreshToken(token) {
  return request({
    url: `/buyer/passport/member/refresh/${token}`,
    method: Method.GET,
    needToken: false,
  });
}

// 获取首页楼层装修数据
export function searchProduct(params) {
  return request({
    url: "/public/c/goods/search",
    method: Method.GET,
    // needToken: true,
    params,
  });
}

// 获取首页楼层装修数据
export function bannerAll() {
  return request({
    url: "/public/c/banner/all",
    method: Method.GET,
  });
}
