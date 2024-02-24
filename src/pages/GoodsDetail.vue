<template>
  <div style="background: #fff">
    <Search></Search>
    <!-- 商品分类 -->
    <cateNav :showAlways="false"></cateNav>

    <!-- 商品信息展示 -->
    <ShowGoods
      @handleClickSku="targetClickSku"
      v-if="goodsMsg"
      :detail="goodsMsg"
    ></ShowGoods>
    <!-- 商品详细展示 -->
    <ShowGoodsDetail v-if="goodsMsg" :detail="goodsMsg"></ShowGoodsDetail>

    <empty
      _Title="Current products have been removed from the shelves"
      v-if="takeDownSale"
    >
      <div class="sale-btn">
        <Button size="small" class="mr_10" @click="target('/')"
          >BACK HOME</Button
        >
        <Button size="small" @click="target('goodsList')"
          >BACK GOODSLIST</Button
        >
      </div>
    </empty>
    <Spin size="large" fix v-if="isLoading"></Spin>
    <BaseFooter></BaseFooter>
  </div>
</template>

<script>
import Search from "@/components/Search";

import ShowGoods from "@/components/goodsDetail/ShowGoods";
import empty from "@/components/empty/Main";
import ShowGoodsDetail from "@/components/goodsDetail/ShowGoodsDetail";
import { goodsSkuDetail } from "@/api/goods";

import { getDetailById } from "@/api/shopentry";
// import imTalk from "@/components/mixes/talkIm";
export default {
  name: "GoodsDetail",
  // beforeRouteEnter(to, from, next) {
  //   window.scrollTo(0, 0);
  //   next();
  // },
  created() {
    this.getGoodsDetail();
  },
  // mixins: [imTalk],
  data() {
    return {
      goodsMsg: {}, // 商品信息
      isLoading: false, // 加载状态
      categoryBar: [], // 分类
      storeCollected: false, // 商品收藏
      storeMsg: {}, // 店铺信息
      takeDownSale: false, // 是否下架
    };
  },
  methods: {
    // 跳转首页或商品页面
    target(url) {
      this.$router.push({ path: url });
    },
    // 点击规格
    targetClickSku(val) {
      this.getGoodsDetail(val);
    },
    // 获取商品详情
    getGoodsDetail(val) {
      this.isLoading = true;
      const params = val || this.$route.query;

      goodsSkuDetail(params)
        .then((res) => {
          this.isLoading = false;
          if (res.code === 200) {
            const result = res.data;
            // const cateName = res.result.categoryName;
            // const cateId = result.data.categoryPath.split(",");
            // const cateArr = [];
            // cateId.forEach((e, index) => {
            //   // 插入分类id和name
            //   cateArr.push({
            //     id: e,
            //     name: cateName ? cateName[index] : "",
            //   });
            // });
            // this.categoryBar = cateArr;
            this.$set(this, "goodsMsg", res.data);

            if (!this.storeMsg) {
              // 获取店铺信息
              getDetailById(this.goodsMsg.storeId).then((res) => {
                if (res.success) {
                  this.storeMsg = res.result;
                }
              });
            }
          } else {
            this.$Message.error(res.message);
            this.isLoading = false;
          }
        })
        .catch((e) => {
          this.isLoading = false;
          if (e.code === 11001) {
            this.takeDownSale = true;
          }
        });
    },
    goGoodsList(currIndex) {
      // 跳转商品列表
      const arr = [];
      this.categoryBar.forEach((e, index) => {
        if (index <= currIndex) {
          arr.push(e.id);
        }
      });
      return location.origin + "/goodsList?categoryId=" + arr.toString();
    },
  },
  watch: {},
  components: {
    Search,
    ShowGoods,
    ShowGoodsDetail,
    empty,
  },
};
</script>
<style scoped lang="scss">
.shop-item-path {
  height: 38px;
  @include background_color($light_background_color);
  line-height: 38px;
  color: #2c2c2c;
}

.shop-nav-container {
  width: 1200px;
  margin: 0 auto;
  position: relative;

  .store-collect {
    position: absolute;
    right: 20px;
    top: 0;
    color: #999;

    span {
      &:hover {
        cursor: pointer;
        color: $theme_color;
      }
    }
  }
}
.sale-btn {
  margin: 10px 0;
}
</style>
