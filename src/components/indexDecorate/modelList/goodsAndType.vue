<template>
  <div class="goods-type-wrapper">
    <div class="flex goods-type-line">
      <div class="goods-type-title">
        <div
          class="boxicon"
          :style="{ backgroundPosition: '-231px -71px' }"
        ></div>
        <span>{{ title }}</span>
        <div class="see-more" @click="handleClick">
          <span>See More</span>
          <i class="iconfont icon-a-iPhone8beifen8"></i>
        </div>
      </div>
      <!-- <div class="flex goods-type-labels">
        <div
          :class="{ active: current === item.___index }"
          class="goods-type-item"
          v-for="(item, index) in paramData.options.labels"
          :key="index"
          @click="handleClickLabel(item, index)"
        >
          {{ item.label }}
        </div>
      </div> -->
    </div>
    <!-- 商品部分 -- 超级品牌日 -->
    <div class="only-goods-list">
      <div
        class="only-goods-list-item"
        v-for="(item, index) in paramData"
        :key="index"
        @click="linkTo(item.id)"
      >
        <div class="goods-img">
          <img :src="item.coverPic" />
        </div>
        <div :style="{ padding: '0 20px' }">
          <div class="goods-name wes-2">
            <template v-for="(tag, index) in item.custTypes">
              <Tag v-if="tag == '1'" color="green">new</Tag>
              <Tag v-if="tag == '2'" color="red">hot</Tag>
              <Tag v-if="tag == '3'" color="primary">featured</Tag>
              <Tag v-if="tag == '4'" color="warning">free</Tag>
            </template>
          </div>

          <div class="goods-desc line-hidden2">{{ item.name }}</div>
        </div>
        <div class="goods-price-login" v-if="isLogin">
          <!-- {{ item.price | unitPrice("￥") }} -->
          ${{ handleNumber(item.price) }}
        </div>
        <div class="goods-price" v-else>
          <!-- {{ item.price | unitPrice("￥") }} -->
          Sign In To See Price
        </div>
        <!-- 查看 -->
        <div class="white-shadow">
          <div class="search">Add to Card</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
var numeral = require("numeral");
export default {
  name: "goods",
  props: {
    paramData: {
      type: Array,
      default: [],
    },
    title: {
      type: String,
      default: "",
    },
    // 商品属性分类: 1： 新商品， 2：热卖商品， 3：新特性商品， 4： 免运费商品 5：其它
    custType: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      current: "",
      isLogin: true,
    };
  },
  watch: {},
  mounted() {
    this.current =
      this.paramData.options && this.paramData.options.labels[0].___index;
  },
  methods: {
    handleClick() {
      this.$router.push({
        path: "/goodsList",
        query: { custType: this.custType },
      });
    },
    handleNumber(val) {
      return numeral(val).format("0.00");
    },
    // 筛选出当前分类下的商品
    handleClickLabel(val, index) {
      this.current = index;
    },
    linkTo(id) {
      this.$router.push({ path: "/goodsDetail", query: { goodsId: id } });
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
.white-shadow {
  opacity: 0;
  transition: bottom 0.5s;
  display: inline;
  width: 100%;
  height: 45px;
  line-height: 45px;
  background: #249fec;
  color: #fff;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  text-align: center;
  position: absolute;
  left: 0;
  bottom: -45px;
  text-align: center;
}
.search {
  opacity: 1;
  font-size: 14px;
  font-weight: normal;
  text-align: center;
  letter-spacing: 0px;
  line-height: 45px;
  color: #ffffff;
}
.only-goods-list {
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
.only-goods-list-item {
  width: 15.9%;
  height: 340px;
  margin: 0 5px 10px;
  box-sizing: border-box;
  opacity: 1;
  cursor: pointer;
  background: #ffffff;
  transition: all 0.4s ease;
  position: relative;
  min-height: 325px;
  overflow: hidden;
  &:hover {
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
    z-index: 2;
    > .white-shadow {
      opacity: 1;
      bottom: 0;
    }
    > .goods-img {
      > img {
        opacity: 0.8 !important;
      }
    }
  }
}
.goods-img {
  margin-bottom: 9.8px;
  text-align: center;
  > img {
    height: 200px;
    transition: all 0.4s ease;
    width: 100%;
  }
}
.goods-name {
  height: 26px;
  font-size: 18px;
  font-weight: normal;
  line-height: 22px;
  width: 100%;
  overflow: hidden;
  letter-spacing: 0px;
  margin: 0 auto 12.4px auto;
  color: #fff;
}
.goods-desc {
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
  height: 34px;
  font-weight: normal;
  line-height: 17px;
  margin-bottom: 12.4px;
  color: #000;
  // css最多显示两行
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.line-hidden2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.goods-price {
  font-size: 15px;
  font-weight: normal;
  line-height: 30px;
  text-align: center;
  letter-spacing: 0px;
  color: #249fec;
}
.goods-price-login {
  padding: 0 20px;
  font-weight: 700;
  color: red;
  font-size: 20px;
  font-weight: normal;
  line-height: 30px;
  letter-spacing: 0px;
}
.goods-type-line {
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
}
.goods-type-title {
  font-size: 20px;
  font-weight: normal;
  letter-spacing: 0px;
  color: #3a3a3a;
  width: 100%;
}
.active {
  color: #f31947;
}
.goods-type-labels {
  cursor: pointer;
  font-size: 21px;
  font-weight: normal;
  line-height: 25px;
  letter-spacing: 0px;
}
.goods-type-item {
  margin-left: 28px;
}
.boxicon {
  width: 27px;
  height: 27px;
  display: inline-block;
  background-image: url(../../../assets/images/homeicon.png);
  transform: translateY(6px);
  margin-right: 6px;
}
.see-more {
  color: #249fec;
  float: right;
  font-size: 15px;
  font-weight: 580;
  height: 35px;
  line-height: 35px;
  cursor: pointer;

  &:hover {
    span {
      text-decoration: underline;
    }
    color: #ff9934;
  }
}
</style>
