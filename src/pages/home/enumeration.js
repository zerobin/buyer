/*
 * @Date: 2023-11-19 13:06:03
 * @LastEditors: 庄鸿斌
 * @LastEditTime: 2024-02-02 16:40:48
 */
// 订单状态
export const orderStatusList = [
  {
    name: "all",
    status: "ALL",
  },
  {
    name: "Submitted",
    status: "0",
  },
  {
    name: "In progress",
    status: "1",
  },
  {
    name: "Successful",
    status: "2",
  },
  {
    name: "Failed Transaction",
    status: "3",
  },
  {
    name: "Cancel",
    status: "-1",
  },
];
export const tagcoloroOderStatusList = [
  {
    name: "all",
    status: "ALL",
  },
  {
    name: "orange",
    status: "0",
  },
  {
    name: "primary",
    status: "1",
  },
  {
    name: "success",
    status: "2",
  },
  {
    name: "error",
    status: "3",
  },
  {
    name: "warning",
    status: "-1",
  },
];
// 订单售后状态
export const afterSaleStatusList = [
  {
    name: "申请中",
    status: "APPLY",
  },
  {
    name: "通过",
    status: "PASS",
  },
  {
    name: "拒绝",
    status: "REFUSE",
  },
  {
    name: "买家退货，待卖家收货",
    status: "BUYER_RETURN",
  },
  {
    name: "卖家确认收货",
    status: "SELLER_CONFIRM",
  },
  {
    name: "卖家终止售后",
    status: "SELLER_TERMINATION",
  },
  {
    name: "买家确认收货",
    status: "BUYER_CONFIRM",
  },
  {
    name: "买家取消售后",
    status: "BUYER_CANCEL",
  },
  {
    name: "完成售后",
    status: "COMPLETE",
  },
  {
    name: "等待平台退款",
    status: "WAIT_REFUND",
  },
];
