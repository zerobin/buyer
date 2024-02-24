/*
 * @Date: 2024-02-01 11:38:00
 * @LastEditors: 庄鸿斌
 * @LastEditTime: 2024-02-01 13:51:28
 */
import Vue from "vue";

import App from "./ShareApp";
import router from "./router/share.js";

Vue.config.productionTip = false;
console.log("111");
new Vue({
  el: "#app",
  router,
  render: (h) => h(App),
});
