/*
 * @Date: 2023-11-19 13:06:02
 * @LastEditors: 庄鸿斌
 * @LastEditTime: 2024-01-21 15:05:56
 */
import request, { Method } from "@/plugins/request.js";

// 商品列表
export function goodsList(params) {
  return request({
    url: "/buyer/goods/goods/es",
    method: Method.GET,
    needToken: false,
    params,
  });
}

// 商品分类 筛选条件  品牌， 尺寸等
export function filterList(params) {
  return request({
    url: "/buyer/goods/goods/es/related",
    method: Method.GET,
    needToken: false,
    params,
  });
}

// id获取商品详情
export function goodsDetail(goodsId) {
  return request({
    url: `/buyer/goods/goods/get/${goodsId}`,
    method: Method.GET,
    needToken: false,
  });
}

// id获取商品Sku详情
export function goodsSkuDetail(params) {
  return request({
    url: `/public/c/goods/detail`,
    method: Method.GET,
    needToken: true,
    params,
  });
}

// 获取所有商品分类
export function getCategory(parentId) {
  return request({
    url: "/public/c/category/list",
    method: Method.POST,
    needToken: false,
  });
}

// 当前拼团活动未成团会员
export function pintuanMembers(pintuanId) {
  return request({
    url: `/buyer/promotion/pintuan/${pintuanId}/members`,
    method: Method.GET,
    needToken: false,
  });
}

/**
 * 获取搜索热词
 * @param {Number} count 获取搜索热词数量
 */
export function hotWords(params) {
  return request({
    url: `/buyer/goods/goods/hot-words`,
    method: Method.GET,
    needToken: false,
    params,
  });
}

export function getGoodsByCustType(params) {
  return request({
    url: "/public/c/goods/cus-type",
    method: Method.GET,
    needToken: false,
    // headers: { "Content-Type": "application/json" },
    params,
  });
}
// 品牌
export function categoryBrands(params) {
  return request({
    url: "/public/c/category/brands",
    method: Method.GET,
    needToken: false,
    // headers: { "Content-Type": "application/json" },
    params,
  });
}

export function categoryFilterList(params) {
  return request({
    url: "/public/c/category/filterList",
    method: Method.GET,
    needToken: false,
    // headers: { "Content-Type": "application/json" },
    params,
  });
}

export function goodsFilterList(data) {
  return request({
    url: "/public/c/goods/filterGoods",
    method: Method.POST,
    needToken: false,
    headers: { "Content-Type": "application/json" },
    data,
  });
}

export function apiGoodsSearch(params) {
  return request({
    url: "/public/c/goods/search",
    method: Method.GET,
    needToken: false,
    // headers: { "Content-Type": "application/json" },
    params,
  });
}
