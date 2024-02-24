<template>
  <div class="container">
    <Modal v-model="showCpmodel" width="350">
      <template #header>
        <p style="color: black; text-align: left">
          <!-- <Icon type="ios-information-circle"></Icon> -->
          <span>活动优惠券</span>
        </p>
      </template>
      <template>
        <Scroll :on-reach-bottom="handleReachBottom">
          <Card
            dis-hover
            v-for="(item, index) in autoCoupList"
            :key="index"
            style="margin: 10px 15px"
          >
            <span
              v-if="item.couponType === 'PRICE'"
              class="fontsize_12 global_color"
              style="font-size: 15px"
              >￥<span class="price">{{ item.price | unitPrice }}</span></span
            >
            <span
              v-if="item.couponType === 'DISCOUNT'"
              class="fontsize_12 global_color"
              style="font-size: 15px"
              ><span class="price">{{ item.discount }}</span
              >折</span
            >
            <span class="describe" style="font-size: 15px; margin-left: 5px"
              >满{{ item.consumeThreshold }}元可用</span
            >
            <p style="font-size: 10px">
              使用范围：{{ useScope(item.scopeType, item.storeName) }}
            </p>
            <p style="font-size: 10px">有效期：{{ item.endTime }}</p>
          </Card>
        </Scroll>
      </template>
      <template #footer>
        <Button type="error" @click="showCpmodel = false">确定</Button>
      </template>
    </Modal>

    <!-- 固定头部 -->
    <hover-search
      class="hover-search"
      :class="{ show: topSearchShow }"
    ></hover-search>
    <!-- 顶部广告 -->
    <FixedTopPage :data="topAdvert"></FixedTopPage>
    <!-- 头部 包括登录，我的订单等 -->
    <!-- <BaseHeader></BaseHeader> -->
    <!-- 搜索框、logo -->
    <Search></Search>
    <!-- 商品分类 -->
    <cateNav :showAlways="true"></cateNav>
    <div class="model-form">
      <div class="model-content">
        <!-- <model-form-item
          :element="element"
          :index="index"
          :data="data"
        ></model-form-item> -->
        <!-- 轮播图 -->
        <modelCarousel :swiper="swiper" class="mb_20"></modelCarousel>
        <!-- 站点信息 -->
        <onlyGoodsModel :data="siteInfo" class="mb_20"></onlyGoodsModel>
        <!-- 免运费商品 -->
        <goodsAndType
          v-if="goodsFree.length"
          :paramData="goodsFree"
          title="FREE SHIPPING"
          :custType="4"
        ></goodsAndType>

        <!-- 新品商品 -->
        <goodsAndType
          v-if="goodsNew.length"
          :paramData="goodsNew"
          title="NEW ARRIVALS"
          :custType="1"
        ></goodsAndType>

        <!-- 热卖商品 -->
        <goodsAndType
          v-if="goodsHot.length"
          :paramData="goodsHot"
          title="BEST SELLERS"
          :custType="2"
        ></goodsAndType>
        <div
          class=""
          style="
            cursor: pointer;
            margin: 20px auto;
            max-width: 1440px;
            margin: 0 auto;
            overflow: hidden;
            height: 200px;
          "
          @click="linkTo(midBanner.value)"
        >
          <img style="height: 200px" :src="midBanner.key" alt="" />
        </div>
        <!-- 特色商品 -->
        <goodsAndType
          :paramData="goodsFeatured"
          title="FEATURED PRODUCTS"
          :custType="3"
        ></goodsAndType>
      </div>
    </div>
    <def-comment />
    <!-- 楼层装修部分 -->
    <!-- <model-form ref="modelForm" :data="modelForm"></model-form> -->
    <!-- 底部栏 -->
    <BaseFooter></BaseFooter>
    <!-- 侧边栏 -->
    <fixedBar
      class="fixed-bar"
      :class="{ 'show-fixed': topSearchShow }"
    ></fixedBar>
  </div>
</template>

<script>
import Search from "@/components/Search";
import ModelForm from "@/components/indexDecorate/ModelForm";
import HoverSearch from "@/components/header/hoverSearch";
import fixedBar from "@/components/fixed/index";
import storage from "@/plugins/storage";
import { indexData, bannerAll } from "@/api/index";
import { seckillByDay } from "@/api/promotion";
import ModelFormItem from "@/components/indexDecorate/ModelFormItem.vue";
import ModelCarousel from "@/components/indexDecorate/modelList/Carousel.vue";
import goodsAndType from "@/components/indexDecorate/modelList/goodsAndType.vue";
import onlyGoodsModel from "@/components/indexDecorate/modelList/onlyGoodsModel.vue";
import defComment from "./defComment.vue";
import * as apiGoods from "@/api/goods";
export default {
  name: "Index",
  mounted() {
    // this.getIndexData();
    this.getBannerAll();
    let that = this;
    window.onscroll = function () {
      let top = document.documentElement.scrollTop || document.body.scrollTop;
      if (top > 300) {
        that.topSearchShow = true;
      } else {
        that.topSearchShow = false;
      }
    };
    // if (storage.getItem("userInfo")) {
    //   this.getAutoCoup();
    // }
  },
  data() {
    return {
      loading: false,
      total: 0,
      params: {
        // 请求参数
        pageNumber: 0,
        pageSize: 12,
      },
      autoCoupList: [],
      showCpmodel: false,
      modelForm: { list: [] }, // 楼层装修数据
      topAdvert: {}, // 顶部广告
      swiper: [], // 轮播图
      midBanner: {},
      goodsFree: [], // 免运费
      goodsNew: [], // 新品
      goodsHot: [], // 热卖
      goodsFeatured: [], // 特色
      siteInfo: [], // 网站信息
      showNav: false, // 是否展示分类栏
      topSearchShow: false, // 滚动后顶部搜索栏展示
      carouselLarge: false, // 不同轮播分类尺寸
      carouselOpacity: false, // 不同轮播分类样式
    };
  },
  created() {
    this.getGoods(4);
    this.getGoods(1);
    this.getGoods(2);
    this.getGoods(3);
  },
  methods: {
    // 获取商品列表
    getGoods(custType) {
      this.loading = true;
      apiGoods
        .getGoodsByCustType(Object.assign({ custType }, this.params))
        .then((res) => {
          console.log(res.rows, "00000");
          this.loading = false;
          switch (custType) {
            case 4:
              this.goodsFree = res.rows;
              break;
            case 1:
              this.goodsNew = res.rows;
              break;
            case 2:
              this.goodsHot = res.rows;
              break;
            case 3:
              this.goodsFeatured = res.rows;
              break;
          }

          // this.total = res.total;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 获取所有banner数据
    getBannerAll() {
      bannerAll().then((res) => {
        let banners = res.data || [];
        banners.forEach((item) => {
          switch (item.bannerType) {
            case 0:
              this.topAdvert = item.urls[0];
              break;
            case 1:
              this.swiper = item.urls;
              break;
            case 2:
              console.log(item.urls, "0000000");
              this.siteInfo = item.urls;
              break;
            case 3:
              this.midBanner = item.urls[0];
              break;
            case 4:
              // this.siteInfo = item.urls;
              break;
          }
        });
      });
    },
    // 优惠券可用范围
    useScope(type, storeName) {
      let shop = "平台";
      let goods = "全部商品";
      if (storeName !== "platform") shop = storeName;
      switch (type) {
        case "ALL":
          goods = "全部商品";
          break;
        case "PORTION_GOODS":
          goods = "部分商品";
          break;
        case "PORTION_GOODS_CATEGORY":
          goods = "部分分类商品";
          break;
      }
      return `${shop}${goods}可用`;
    },
    getAutoCoup() {
      let data = new Date();
      let datas = data.getDate();
      let hours = data.getHours();
      let flagCoup = storage.getItem("getTimes"); //缓存
      if (flagCoup && flagCoup != undefined && flagCoup != null) {
        //判断当前是否有缓存
        if (Number(datas) > Number(flagCoup)) {
          //判断缓存是否小于当前天数
          if (Number(hours) >= 6) {
            //超过或等于6时清楚缓存
            storage.setItem("getTimes", datas); //存储缓存
            this.getcps();
          }
        }
      } else {
        // window.localStorage.setItem('getTimes',datas)//存储缓存
        this.getcps();
      }
    },
    getcps() {
      console.log(123123);
      let data = new Date();
      let datas = data.getDate();
      getAutoCoup().then((res) => {
        //调用自动发券
        if (res.success) {
          this.autoCoupList.push(...res.result);
          let objs = {};
          this.autoCoupList = this.autoCoupList.reduce((cur, next) => {
            //对象去重
            if (next.id != undefined) {
              objs[next.id] ? "" : (objs[next.id] = true && cur.push(next));
            }
            return cur;
          }, []);
          if (this.autoCoupList != "" && this.autoCoupList.length > 0) {
            console.log(1231232132);
            this.showCpmodel = true;
          }
          storage.setItem("getTimes", datas); //存储缓存
        }
      });
    },
    handleReachBottom() {},
    getIndexData() {
      // 获取首页装修数据
      indexData().then(async (res) => {
        if (res.success) {
          let dataJson = JSON.parse(res.result.pageData);
          // 秒杀活动不是装修的数据，需要调用接口判断是否有秒杀商品
          // 轮播图根据不同轮播，样式不同
          for (let i = 0; i < dataJson.list.length; i++) {
            let type = dataJson.list[i].type;
            if (type === "carousel2") {
              this.carouselLarge = true;
            } else if (type === "carousel1") {
              this.carouselLarge = true;
              this.carouselOpacity = true;
            } else if (type === "seckill") {
              let seckill = await this.getListByDay();
              dataJson.list[i].options.list = seckill;
            }
          }
          this.modelForm = dataJson;
          storage.setItem("navList", dataJson.list[1]);
          this.showNav = true;
          this.topAdvert = dataJson.list[0];
        }
      });
    },
    async getListByDay() {
      // 当天秒杀活动
      const res = await seckillByDay();
      if (res.success && res.result.length) {
        return res.result;
      } else {
        return [];
      }
    },
    linkTo(url) {
      console.log(url, "--");
      if (url) {
        window.location.href = url;
      }
    },
  },
  components: {
    Search,
    ModelForm,
    HoverSearch,
    fixedBar,
    ModelFormItem,
    ModelCarousel,
    goodsAndType,
    onlyGoodsModel,
    defComment,
  },
};
</script>

<style scoped lang="scss">
@import "../assets/styles/coupon.scss";
.container {
  @include sub_background_color($light_background_color);
}
.model-content {
  width: 100%;
  min-height: 1200px;
}
.model-item {
  position: relative;
  margin-bottom: 10px;
}
.bannerAd {
  width: 1183px;
  height: 166.6px;
  border-radius: 10px;
}
/** 热门广告 */
.advert-list {
  background: $theme_color;
  height: 200px;
  display: flex;
  justify-content: space-around;
  padding: 3px 10px;
  > li {
    img {
      cursor: pointer;
      border-radius: 10px;
      transition: all 150ms ease-in-out;
      &:hover {
        transform: translateY(-3px);
        box-shadow: rgba(0, 0, 0, 0.4) 0px 5px 20px 0px;
      }
    }
  }
}

/** 折扣广告 */
.discountAdvert {
  width: 1300px;
  height: 566px;
  margin: 0 auto;
  margin-bottom: 20px;
  background-repeat: no-repeat;
  position: relative;
  left: -47px;
  padding-left: 295px;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  img {
    margin-top: 10px;
    margin-right: 10px;
    transition: all 150ms ease-in-out;
    &:hover {
      box-shadow: 0 5px 12px 0 rgba(0, 0, 0, 0.4);
      transform: translateY(-2px);
    }
  }
}
</style>
<style>
.hover-search {
  width: 100%;
  height: 60px;
  transform: translateY(-200px);
  background-color: #fff;
  position: fixed;
  top: 0;
  z-index: 9999;
  box-shadow: 0 0 10px 2px rgb(90 90 90 / 60%);
  transition: 0.35s;
}
.show {
  transform: translateY(0);
  -webkit-transform: translateZ(0);
  -moz-transform: translateZ(0);
  -ms-transform: translateZ(0);
  -o-transform: translateZ(0);
  transform: translateZ(0);
  top: 0;
}
.fixed-bar {
  opacity: 0 !important;
  transform: translateY(-10px);
  transition: 0.35s;
  z-index: 999999;
  height: 0px !important;
  overflow: hidden;
}
.show-fixed {
  /* height: 354px !important; */
  opacity: 1 !important;
  transform: translateY(0);
  -webkit-transform: translateZ(0);
  -moz-transform: translateZ(0);
  -ms-transform: translateZ(0);
  -o-transform: translateZ(0);
  transform: translateZ(0);
}

/* 2K */
@media screen and (min-width: 2561px) and (max-width: 3840px) {
  /* 样式 */
  .fixed-bar {
    position: fixed;
    right: 900px;
    top: 500px;
  }
}

/* 1080p */
@media screen and (max-width: 2560px) {
  /* 样式 */
  .fixed-bar {
    position: fixed;
    right: 300px;
    top: 500px;
  }
}

@media screen and (max-width: 2025px) {
  /* 样式 */
  .fixed-bar {
    position: fixed;
    right: 0px;
    top: 300px;
  }
}
</style>
