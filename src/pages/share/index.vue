<!--
 * @Date: 2024-02-17 14:02:20
 * @LastEditors: 庄鸿斌
 * @LastEditTime: 2024-02-20 23:49:58
-->
<template>
  <div class="login">
    <div v-html="shareInfo"></div>
  </div>
</template>

<script>
import { aipgetShareInfo } from "@/api/share.js";
import Storage from "@/plugins/storage";
export default {
  name: "Share",
  data() {
    return {
      shareCode: "",
      shareInfo: "",
    };
  },
  watch: {},
  mounted() {
    this.shareCode = this.$route.query.sc;
    if (this.shareCode) {
      Storage.setItem("SHARE_CODE", this.shareCode);
    } else {
      Storage.removeItem("SHARE_CODE");
    }
    this.$nextTick(() => {
      this.getShareInfo({ shareCode: this.shareCode });
    });
  },
  methods: {
    getShareInfo(data) {
      aipgetShareInfo(data).then((res) => {
        if (res.code === 200) {
          console.log(res);
          this.shareInfo = res.data.content;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
