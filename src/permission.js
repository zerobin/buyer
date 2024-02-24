/*
 * @Date: 2024-02-17 15:14:33
 * @LastEditors: 庄鸿斌
 * @LastEditTime: 2024-02-18 06:51:16
 */
import router from "./router";
import Storage from "./plugins/storage";

router.beforeEach((to, from, next) => {
  if (window.name === "") {
    window.name = "reload";
    Storage.removeItem("SHARE_CODE");
  }
  console.log(to.query.sc, "ccccccccccccccccc");
  if (to.query.sc) {
    Storage.setItem("SHARE_CODE", to.query.sc);
  }
  next();
});
