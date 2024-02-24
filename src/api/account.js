/*
 * @Date: 2023-11-19 13:06:02
 * @LastEditors: 庄鸿斌
 * @LastEditTime: 2024-02-10 13:19:29
 */

import request, { Method } from "@/plugins/request.js";

// 获取用户信息
export function apiGetPersonInfo() {
  return request({
    url: "/c/auth/customer/info",
    method: Method.GET,
    needToken: true,
  });
}

// 更新用户信息
export function apiUpdatePersonInfo(data) {
  return request({
    url: "/c/auth/customer/updatePersonInfo",
    method: Method.POST,
    needToken: true,
    headers: { "Content-Type": "application/json" },
    data,
  });
}

export function updatePwd(data) {
  return request({
    url: "/c/auth/customer/updatePwd",
    method: Method.POST,
    needToken: true,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    data,
  });
}
