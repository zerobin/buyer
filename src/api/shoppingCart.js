import request, { Method } from "@/plugins/request.js";

// 获取首页楼层装修数据
export function indexData(params) {
  return request({
    url: "/buyer/other/pageData/getIndex",
    method: Method.GET,
    needToken: false,
    params,
  });
}

// 添加或者更新购物车
export function addOrUpdateShoppingCart(data) {
  return request({
    url: "/c/auth/shopping-cart/addOrUpdate",
    method: Method.POST,
    needToken: true,
    headers: { "Content-Type": "application/json" },
    data,
  });
}

// 获取购物车列表
export function apiGetShoppingCartList(data) {
  return request({
    url: "/c/auth/shopping-cart/list",
    method: Method.GET,
    needToken: true,
    headers: { "Content-Type": "application/json" },
    data,
  });
}

// 删除购物车
export function apiRemoveCart(data) {
  return request({
    url: "/c/auth/shopping-cart/remove",
    method: Method.POST,
    needToken: true,
    headers: { "Content-Type": "application/json" },
    data,
  });
}
