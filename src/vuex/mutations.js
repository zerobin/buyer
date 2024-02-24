/*
 * @Date: 2023-11-19 13:06:03
 * @LastEditors: 庄鸿斌
 * @LastEditTime: 2024-02-12 14:32:03
 */
// 全部商品分类
export const SET_CATEGORY = (state, data) => {
  state.category = data;
};
export const SET_NAVLIST = (state, data) => {
  state.navList = data;
};
export const SET_CARTNUM = (state, data) => {
  state.cartNum = data;
};
export const SET_HOTWORDS = (state, data) => {
  state.hotWordsList = data;
};
export const SET_LOGOIMG = (state, data) => {
  state.logoImg = data;
};
export const SET_SITENAME = (state, data) => {
  state.siteName = data;
};
export const SET_CARTLIST = (state, data) => {
  state.cartList = data;
};

export const ADD_PRODUCT = (state, data) => {
  state.cartList = data;
};
