/*
 * @Date: 2023-11-19 13:06:02
 * @LastEditors: 庄鸿斌
 * @LastEditTime: 2024-02-17 18:43:00
 */
import request, { Method } from "@/plugins/request.js";

export function apiFeedbackSave(data) {
  return request({
    url: "/public/c/feedback/save",
    method: Method.POST,
    needToken: false,
    headers: { "Content-Type": "application/json" },
    data,
  });
}
