<!--
 * @Date: 2023-11-19 13:06:02
 * @LastEditors: 庄鸿斌
 * @LastEditTime: 2024-02-02 15:38:45
-->
<template>
  <div class="empty">
    <img
      class="empty-img"
      :style="{ width: _Size + 'px' }"
      src="../../assets/images/empty.png"
      alt=""
    />
    <p v-if="_Title">{{ _Title }}</p>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "Main",
  props: {
    _Title: {
      // 描述内容
      type: null,
      default: "No more",
    },
    _Size: {
      // 图片大小
      type: Number,
      default: 150,
    },
  },
};
</script>

<style scoped lang="scss">
.empty {
  margin: 30px 0;
  text-align: center;
  width: 100%;
}
p {
  cursor: pointer;
}
</style>
