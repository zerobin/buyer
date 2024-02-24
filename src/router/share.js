/*
 * @Date: 2024-02-01 11:42:57
 * @LastEditors: 庄鸿斌
 * @LastEditTime: 2024-02-17 14:02:55
 */
import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

// 公共路由
export const constantRoutes = [
  {
    path: "/share",
    component: () => import("@/pages/share/index"),
    hidden: true,
  },
];

export default new Router({
  mode: "history", // 去掉url中的#
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes,
});
