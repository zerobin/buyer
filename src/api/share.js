/*
 * @Date: 2023-07-29 14:34:49
 * @LastEditors: 庄鸿斌
 * @LastEditTime: 2024-02-17 14:13:14
 */
import request, { Method } from "@/plugins/request.js";
// 获取分享内容
export function aipgetShareInfo(params) {
  return request({
    url: "/public/share",
    method: Method.GET,
    needToken: false,
    params,
  });
}
