/*
 * @Date: 2023-11-19 13:06:03
 * @LastEditors: 庄鸿斌
 * @LastEditTime: 2024-02-12 13:52:22
 */
import Vue from "vue";
import Vuex from "vuex";
import * as actions from "./actions";
import * as mutations from "./mutations";
import getters from "./getters";
import storage from "@/plugins/storage.js";
import createPersistedState from "vuex-persistedstate";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    navList: [], // 首页快捷导航
    cartNum: storage.getItem("cartNum") || 0,
    logoImg: require("@/assets/images/logo2.png"),
    siteName: storage.getItem("siteName") || "lilishop",
    hotWordsList: storage.getItem("hotWordsList"),
    category: JSON.parse(localStorage.getItem("category")),
    cartList: [],
  },
  getters,
  actions,
  mutations,
  plugins: [
    createPersistedState({
      render(state) {
        return { ...state };
      },
    }),
  ],
});
