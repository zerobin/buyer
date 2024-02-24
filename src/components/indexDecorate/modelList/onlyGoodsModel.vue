<template>
  <div class="goods-type-wrapper">
    <!-- 商品部分 -->
    <div class="only-goods-list flex">
      <div
        class="only-goods-list-item"
        v-for="(item, index) in data"
        :key="index"
        @click="handleClick(item)"
      >
        <div class="goods-img">
          <img :src="item.key" />
          <!-- <img v-if="index === 0" src="../../../assets/images/brand/1.webp" />
          <img v-if="index === 1" src="../../../assets/images/brand/2.png" />
          <img v-if="index === 2" src="../../../assets/images/brand/3.jpg" />
          <img v-if="index === 3" src="../../../assets/images/brand/4.png" />
          <img v-if="index === 4" src="../../../assets/images/brand/5.jpg" /> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "onlyGoodsList",
  props: {
    data: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      flag: false,
      tabIndex: 0,
      current: 0,
      showModal: false,
      selected: {}, // 已选数据
      picModelFlag: false,
    };
  },
  mounted() {},
  methods: {
    handleClick(val) {
      this.linkTo(val.url);
    },
  },
};
</script>

<style scoped lang="scss">
.goods-type-wrapper {
  padding: 15px 4px 0 10px;
  max-width: 1920px;
  margin: 0 auto 10px;
}
.del-btn {
  margin-left: 10px;
}
.tab-bar {
  margin-bottom: 20px;
}
.draggable {
  padding: 10px;
  border-bottom: 1px solid #ededed;
  transition: 0.35s;

  &:hover {
    background-color: #ededed;
  }
}
.column-config {
  margin-left: 10px;
  > * {
    margin: 4px;
  }
}
.column-img {
  width: 100px;
  height: 100px;
}
.add-goods {
  margin-left: 20px;
  margin-bottom: 10px;
}
.only-goods-list {
  // position: relative;
  // flex-wrap: wrap;
  // justify-content: space-between;
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
  &:hover {
    > .setup-box {
      display: block;
    }
  }
}
.column-goods-config {
  flex: 2;
  align-items: center;
  justify-content: space-between;
}
.only-goods-list-item {
  margin-right: 10px;
  width: 19.5%;
  cursor: pointer;
  background: #ffffff;
  transition: 0.35s;
  &:hover {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    transform: scale(1.03);
  }
}
.goods-img {
  width: 100%;
  text-align: center;
  min-height: 100px;
  > img {
    width: 100%;
    max-height: 183px;
  }
}

.goods-price {
  font-size: 25.2px;
  font-weight: normal;
  line-height: 30px;
  text-align: center;
  letter-spacing: 0px;

  color: $theme_color;
  -webkit-text-stroke: #979797 0.7px; /* 浏览器可能不支持 */
}
.goods-type-line {
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}
.goods-type-title {
  font-size: 31px;
  font-weight: normal;
  line-height: 37px;
  letter-spacing: 0px;

  color: #333333;
}
.active {
  color: $theme_color;
}
.goods-type-labels {
  font-size: 21px;
  font-weight: normal;
  line-height: 25px;
  letter-spacing: 0px;
}
.goods-type-item {
  margin-left: 28px;
}
</style>
