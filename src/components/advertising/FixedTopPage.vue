<!--
 * @Date: 2023-11-19 13:06:02
 * @LastEditors: 庄鸿斌
 * @LastEditTime: 2024-01-16 22:13:55
-->
<template>
  <!-- 头部广告 -->
  <div
    class="advertising"
    v-if="isShow"
    :style="{ 'background-color': data.bgColor }"
  >
    <a
      class="hover-pointer CommonHeadTopBanner"
      @click="linkTo(data.value)"
      :style="{
        backgroundImage: `url(${data.key})`,
        backgroundSize: 'auto 100%',
      }"
    ></a>

    <!-- <Icon type="md-close-circle" size="20" @click="show = false" /> -->
  </div>
</template>
<script>
export default {
  props: {
    data: {
      // 传入的广告信息
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      show: true, // 是否显示头部广告
    };
  },
  computed: {
    isShow() {
      return !!this.data.key;
    },
  },
  methods: {
    linkTo(url) {
      if (url) {
        window.location.href = url;
      }
    },
  },
};
</script>
<style scoped lang="scss">
.advertising {
  height: 50px;
  width: 100%;

  text-align: center;
  overflow: hidden;
  position: relative;
  *:nth-child(2) {
    position: relative;
    right: 36px;
    top: -57px;
    cursor: pointer;
  }
}
.CommonHeadTopBanner {
  display: block;
  position: relative;
  background-position: 50%;
  max-width: 1920px;
  margin: 0 auto;
  height: 50px;
}
</style>
