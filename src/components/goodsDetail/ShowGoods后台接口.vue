<template>
  <div class="wrapper">
    <div class="item-detail-show">
      <!-- 详情左侧展示数据、图片，收藏、举报 -->
      <!-- 大图、放大镜 -->

      <div class="item-detail-left">
        <!-- <div  id="dplayer"></div> -->
        <div class="item-detail-big-img">
          <pic-zoom
            v-if="this.skusImgSelect && this.matchingIndex !== -1"
            :url="
              skuDetail.skus[this.matchingIndex] &&
              skuDetail.skus[this.matchingIndex].images[0].url
            "
            :scale="2"
          ></pic-zoom>
          <pic-zoom
            v-if="!this.skusImgSelect && imgList"
            :url="imgList && imgList[imgIndex]"
            :scale="2"
          ></pic-zoom>
        </div>

        <swiper :options="swiperOption" ref="mySwiper">
          <swiper-slide v-for="(item, index) in imgList" :key="index">
            <div
              class="content hover-pointer"
              @mouseover="
                imgIndex = index;
                skusImgSelect = false;
              "
            >
              <img
                style="border-radius: 6px"
                :src="item"
                width="78"
                height="78"
              />
            </div>
          </swiper-slide>
          <div class="swiper-button-prev" slot="button-prev">
            <Icon type="ios-arrow-back" />
          </div>
          <div class="swiper-button-next" slot="button-next">
            <Icon type="ios-arrow-forward" />
          </div>
        </swiper>

        <!-- <div class="goodsConfig mt_10">
          <span @click="collect"
            ><Icon
              type="ios-heart"
              :color="isCollected ? '#ed3f14' : '#666'"
            />{{ isCollected ? "已收藏" : "收藏" }}</span
          >
        </div> -->
      </div>
      <!-- 右侧商品信息、活动信息、操作展示 -->
      <div class="item-detail-right">
        <div class="item-detail-title">
          <p>
            {{ skuDetail.name }}
          </p>
        </div>
        <!-- <div class="rate-box">
          <Rate allow-half v-model="valueHalf" disabled />
          <span class="rate-text">Reviews</span>
        </div> -->
        <!-- <div style="margin-right: 20px; font-size: 16px; color: #999">
          {{RWIP102958}}
        </div> -->
        <div class="sell-point">
          {{ skuDetail.sellingPoint }}
        </div>
        <!-- 限时秒杀 -->
        <!-- <Promotion
          v-if="promotionMap['SECKILL']"
          :time="promotionMap['SECKILL'].endTime"
        ></Promotion> -->
        <!-- 商品详细 价格、优惠券、促销 -->
        <div class="item-detail-price-row">
          <div class="item-price-left">
            <!-- 秒杀价格 -->
            <div
              class="item-price-row"
              v-if="skuDetail.promotionPrice && promotionMap['SECKILL']"
            >
              <p>
                <span class="item-price-title" v-if="promotionMap['SECKILL']"
                  >秒 &nbsp;杀&nbsp;价</span
                >
                <span class="item-price">{{
                  skuDetail.promotionPrice | unitPrice("￥")
                }}</span>
                <span class="item-price-old">{{
                  skuDetail.price | unitPrice("￥")
                }}</span>
              </p>
            </div>
            <!-- 商品原价 -->
            <div class="item-price-row">
              <!-- 批发价格 -->
              <div
                v-if="
                  skuDetail.skus &&
                  skuDetail.skus[this.matchingIndex] &&
                  skuDetail.skus[this.matchingIndex].stepPrices
                "
                class="wholesale"
              >
                <div class="flex wholesale-box">
                  <div
                    v-for="(item, index) in skuDetail.skus[this.matchingIndex]
                      .stepPrices"
                    :key="index"
                    class="wholesale-item"
                    @click="selectWholesale(index, item.from)"
                  >
                    <div class="wholesale-item-content">
                      <p
                        class="wholesale-item-price"
                        :class="
                          wholesaleActive === index
                            ? 'wholesale-item-price-active'
                            : ''
                        "
                      >
                        {{ item.price | unitPrice("$") }}
                      </p>
                      <p class="wholesale-item-number">
                        {{ item.from }} ~ {{ item.to }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 优惠券展示 -->
            <!-- <div
              class="item-price-coupon-row"
              v-if="promotionMap['COUPON'].length"
            >
              <div class="Ellipsis">
                <span class="item-price-title">优 惠 券</span>
                <span>
                  <span
                    class="item-coupon"
                    v-for="(item, index) in promotionMap['COUPON'].slice(0, 6)"
                    :key="index"
                    @click="receiveCoupon(item.id)"
                  >
                    <span v-if="item.couponType == 'PRICE'"
                      >满{{ item.consumeThreshold }}减{{ item.price }}</span
                    >
                    <span v-if="item.couponType == 'DISCOUNT'"
                      >满{{ item.consumeThreshold }}打{{
                        item.couponDiscount
                      }}折</span
                    >
                  </span>
                </span>

                <div class="dropdown" v-if="promotionMap['COUPON'].length > 6">
                  <span>展开更多</span>
                  <div class="dropdown-content">
                    <span
                      class="item-coupon"
                      v-for="(item, index) in promotionMap['COUPON'].slice(
                        6,
                        promotionMap['COUPON'].length
                      )"
                      :key="index"
                      @click="receiveCoupon(item.id)"
                    >
                      <span v-if="item.couponType == 'PRICE'"
                        >满{{ item.consumeThreshold }}减{{ item.price }}</span
                      >
                      <span v-if="item.couponType == 'DISCOUNT'"
                        >满{{ item.consumeThreshold }}打{{
                          item.couponDiscount
                        }}折</span
                      >
                    </span>
                  </div>
                </div>
              </div>
            </div> -->
            <!-- 满减展示 -->
            <!-- <div class="item-price-row" v-if="promotionMap['FULL_DISCOUNT']">
              <p>
                <span class="item-price-title">促销</span>
                <span class="item-promotion">满减</span>
                <span
                  class="item-desc-pintuan"
                  v-if="promotionMap['FULL_DISCOUNT'].fullMinus"
                  >满{{ promotionMap["FULL_DISCOUNT"].fullMoney }}元，立减现金{{
                    promotionMap["FULL_DISCOUNT"].fullMinus
                  }}元</span
                >
                <span
                  class="item-desc-pintuan"
                  v-if="
                    promotionMap['FULL_DISCOUNT'].fullRate &&
                    promotionMap['FULL_DISCOUNT'].fullRateFlag
                  "
                  >满{{ promotionMap["FULL_DISCOUNT"].fullMoney }}元，立享{{
                    promotionMap["FULL_DISCOUNT"].fullRate
                  }}折</span
                >
              </p>
            </div> -->
          </div>
        </div>
        <div class="item-select-column">
          <div class="item-select-title">
            <p>Product Specifications</p>
          </div>
          <div style="width: 75%; flex-flow: wrap" class="item-select">
            <div v-for="(sku, index) in skuDetail.skus" :key="index">
              <div
                class="item-select-intro skys-item"
                :class="[active === index ? 'active' : '']"
                @click="selectSku(index)"
              >
                <p>{{ sku.desc }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="add-buy-car-box">
          <div class="item-select">
            <div class="item-select-title">
              <p>Quantity</p>
            </div>
            <div class="item-select-row">
              <InputNumber
                :min="1"
                :max="skuDetail.quantity"
                :disabled="skuDetail.quantity === 0"
                v-model="count"
                :precision="0.1"
                @on-change="changeCount"
              ></InputNumber>
              <!-- <span class="inventory"> 库存{{ skuDetail.quantity }}</span> -->
            </div>
          </div>
          <div
            class="item-select"
            v-if="skuDetail.skus && skuDetail.skus.length"
          >
            <div class="item-select-title">
              <p>Total</p>
            </div>
            <div class="item-select-row" v-if="this.matchingIndex !== -1">
              <span class="goods-total"> ${{ getPrice() }}</span>
            </div>
            <div class="item-select-row" v-else>
              <span class="goods-total goods-total-disable"> $0</span>
            </div>
          </div>
          <div
            class="add-buy-car"
            v-if="$route.query.way === 'POINT' && skuDetail.authFlag === 'PASS'"
          >
            <Button
              type="error"
              :loading="loading"
              :disabled="skuDetail.quantity === 0"
              @click="pointPay"
              >积分购买</Button
            >
          </div>
          <div class="add-buy-car">
            <!-- <Button
              class="buy-now"
              type="error"
              :loading="loading"
              :disabled="skuDetail.quantity === 0"
              @click="buyNow"
              >Buy Now</Button
            > -->
            <Button
              class="add-to-cart"
              :class="this.matchingIndex === -1 ? 'disable-add-cart' : ''"
              type="warning"
              :loading="loading1"
              :disabled="skuDetail.quantity === 0"
              @click="addShoppingCartBtn"
              >Add to Cart</Button
            >
            <!--
            <Tooltip content="观看视频" v-if="skuDetail.goodsVideo">
              <img
                class="view-video"
                @click="showGoodsVideo = true"
                :src="require('@/assets/iconfont/play.svg')"
                alt=""
              />
            </Tooltip> -->
          </div>
        </div>
      </div>
      <!-- <Modal title="浏览视频" v-model="showGoodsVideo">
        <div id="dplayer"></div>
      </Modal> -->
    </div>
  </div>
</template>

<script>
// import Promotion from "./Promotion.vue";
import PicZoom from "vue-piczoom"; // 图片放大
import DPlayer from "dplayer";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import "swiper/dist/css/swiper.css";

import {
  collectGoods,
  isCollection,
  receiveCoupon,
  cancelCollect,
} from "@/api/member.js";

import { addOrUpdateShoppingCart } from "@/api/shoppingCart.js";

export default {
  name: "ShowGoods",
  props: {
    // 商品数据
    detail: {
      type: Object,
      default: null,
    },
  },
  watch: {
    detail: {
      handler(val) {
        debugger;
        this.skuDetail = JSON.parse(JSON.stringify(val));
        console.log(this.skuDetail, "cccccccccccc");
        this.extractSpecList(); // 在组件加载完成后调用该方法
        this.formatButtonText();
        // this.wholesaleList = val.wholesaleList;
        // if (this.wholesaleList && this.wholesaleList.length > 0) {
        //   this.count = this.wholesaleList[0].num;
        // }
        this.swiperGoodsImg();
      },
      deep: true,
      immediate: true,
    },
  },
  data() {
    return {
      amount: 0, // 总价
      userInfo: {},
      goodsId: 0,
      isLogin: false,
      active: 0,
      wholesaleActive: 0,
      valueHalf: 5,
      showGoodsVideo: false,
      goodsVideo: "",
      wholesaleList: [],
      count: 1, // 商品数量
      imgIndex: 0, // 展示图片下标
      currentSelceted: [], // 当前商品sku
      imgList: [], // 商品图片列表
      skuDetail: {
        skus: [],
      }, // sku详情
      goodsSpecList: this.detail.skus, // 商品spec
      promotionMap: {
        // 活动状态
        SECKILL: null,
        FULL_DISCOUNT: null,
        COUPON: [],
      }, // 促销活动
      formatList: [], // 选择商品品类的数组
      loading: false, // 立即购买loading
      loading1: false, // 加入购物车loading
      isCollected: false, // 是否收藏
      swiperOption: {
        // 轮播图参数

        slidesPerView: 5,
        // 设置点击箭头
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      },
      skuType: {},
      selectedSpecs: {},
      matchingIndex: 0,
      stepPricesIndex: 0,
      skusImgSelect: false, // skus选择对应的图片
    };
  },
  components: { PicZoom, swiper, swiperSlide },
  computed: {
    swiper() {
      // 轮播组件
      return this.$refs.mySwiper.swiper;
    },
    // wholesalePrice(key) {
    //   return this.wholesaleList && this.wholesaleList.length
    //     ? this.wholesaleList.map((item) => {
    //         return item.price;
    //       })
    //     : [];
    // },
    // wholesaleNum(key) {
    //   return this.wholesaleList && this.wholesaleList.length
    //     ? this.wholesaleList.map((item) => {
    //         return item.num;
    //       })
    //     : [];
    // },
  },
  methods: {
    formatButtonText() {
      let skuTypeKeys = Object.keys(this.skuType);
      this.skuDetail &&
        this.skuDetail.skus &&
        this.skuDetail.skus.forEach((skuItem, index) => {
          let skuDesc = "";
          skuTypeKeys.map((typeItem, index) => {
            // skuDesc += item + ":" + activedSku[item] + "+ ";
            if (index + 1 === skuTypeKeys.length) {
              skuDesc += skuItem[typeItem];
            } else {
              skuDesc += skuItem[typeItem] + "/";
            }
          });
          this.$set(this.skuDetail.skus[`${index}`], `desc`, skuDesc);
        });
    },
    getPrice() {
      console.log(this.matchingIndex, this.wholesaleActive, "---asaaaa");
      let price = 0;
      let stepPrice =
        this.skuDetail.skus[this.matchingIndex].stepPrices &&
        this.skuDetail.skus[this.matchingIndex].stepPrices[
          this.wholesaleActive
        ];
      if (stepPrice) {
        price = this.count * stepPrice.price;
        this.amount = stepPrice.price;
      }
      // this.amount = price;
      return price;
    },
    selectWholesale(index, numFrom) {
      console.log(numFrom, "====aaaaaaa");
      this.wholesaleActive = index;
      this.count = +numFrom;
    },

    extractSpecList() {
      this.skuDetail.skus =
        this.skuDetail.skus &&
        this.skuDetail.skus.filter((item) => {
          return !item.deleted;
        });
      this.skuDetail.skus &&
        this.skuDetail.skus.forEach((item, index) => {
          item.specList &&
            item.specList.forEach((spec, specIndex) => {
              // sn不能算在sku里面
              if (spec.specName && spec.specName !== "sn") {
                if (!this.skuType[spec.specName]) {
                  this.skuType[spec.specName] = [];
                }
                this.skuType[spec.specName].push(spec.specValue);
                this.skuType[spec.specName] = Array.from(
                  new Set(this.skuType[spec.specName])
                );
              }
            });
        });
      this.skuType = this.transformSkuType(this.skuType);

      console.log(this.skuType, "9999999999");
    },
    transformSkuType(originalSkuType) {
      const transformedSkuType = {};

      for (const key in originalSkuType) {
        transformedSkuType[key] = {
          value: originalSkuType[key],
        };
      }

      return transformedSkuType;
    },
    // 初始化video
    // initVideo() {
    //   if (!this.goodsVideo) {
    //     setTimeout(() => {
    //       this.goodsVideo = new DPlayer({
    //         container: document.getElementById("dplayer"),
    //         video: {
    //           url: this.skuDetail.goodsVideo,
    //         },
    //       });
    //     }, 100);
    //   }
    // },

    changeCount(val) {
      if (
        this.skuDetail.skus[this.matchingIndex] &&
        this.skuDetail.skus[this.matchingIndex].stepPrices
      ) {
        this.skuDetail.skus[this.matchingIndex].stepPrices.forEach(
          (item, index) => {
            if (item.from <= val && item.to >= val) {
              this.wholesaleActive = index;
              this.amount = item.price;
            }
          }
        );
      }
    },
    selectSku(actIndex) {
      this.active = actIndex;
      this.matchingIndex = actIndex;
      this.changeCount(this.count);
    },

    addShoppingCartBtn() {
      // 判断用户是否登录
      // if (!this.isLogin) {
      //   // 弹出一个对话框跳转到登录
      //   this.$Modal.confirm({
      //     title: "sign in",
      //     content: "<p>Please login to do this</p>",
      //     okText: "Sign in now",
      //     cancelText: "Continue browsing",
      //     onOk: () => {
      //       this.$router.push({
      //         path: "/login",
      //         query: {
      //           rePath: this.$router.history.current.path,
      //           query: JSON.stringify(this.$router.history.current.query),
      //         },
      //       });
      //     },
      //   });
      // } else {
      //   this.addShoppingCart();
      // }
      this.addShoppingCart();
    },

    addShoppingCart() {
      let skuDesc = "";
      let activedSku = this.skuDetail.skus[this.matchingIndex];
      console.log(this.skuDetail.skus[this.matchingIndex]);
      // 添加购物车
      Object.keys(this.skuType).map((item) => {
        // skuDesc += item + ":" + activedSku[item] + "+ ";
        skuDesc += activedSku[item] + "--";
      });
      console.log(skuDesc, "---");
      const params = {
        goodsPicUrl: this.skuDetail.pics,
        goodsId: this.goodsId,
        goodsName: this.skuDetail.name,
        skuId: this.skuDetail.skus[this.matchingIndex].id,
        skuDesc, //
        userId: this.userInfo.userId,
        quantity: this.count,
        amount: this.amount,
        remark: "",
      };
      this.loading = true;

      addOrUpdateShoppingCart(params)
        .then((res) => {
          this.loading = false;
          if (res.code === 200) {
            // 显示一个弹出框，提示添加到购物车成功
            console.log("添加成功");
            this.$router.push("/cart");
          } else {
            this.$Message.error(res.msg);
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    buyNow() {
      // 立即购买
      const params = {
        num: this.count,
        skuId: this.skuDetail.id,
        cartType: "BUY_NOW",
      };
      // 虚拟商品购买
      if (this.skuDetail.goodsType === "VIRTUAL_GOODS") {
        params.cartType = "VIRTUAL";
      }
      this.loading1 = true;
      addCartGoods(params)
        .then((res) => {
          this.loading1 = false;
          if (res.success) {
            this.$router.push({
              path: "/pay",
              query: { way: params.cartType },
            });
          } else {
            this.$Message.warning(res.message);
          }
        })
        .catch(() => {
          this.loading1 = false;
        });
    },
    async collect() {
      // 收藏商品
      if (this.isCollected) {
        let cancel = await cancelCollect("GOODS", this.skuDetail.id);
        if (cancel.success) {
          this.$Message.success("取消收藏成功");
          this.isCollected = false;
        }
      } else {
        let collect = await collectGoods("GOODS", this.skuDetail.id);
        if (collect.code === 200) {
          this.isCollected = true;
          this.$Message.success("收藏商品成功,可以前往个人中心我的收藏查看");
        }
      }
    },

    receiveCoupon(id) {
      // 领取优惠券
      receiveCoupon(id).then((res) => {
        if (res.success) {
          this.$Message.success("优惠券领取成功");
        } else {
          this.$Message.warning(res.message);
        }
      });
    },
    // promotion() {
    // 格式化促销活动，返回当前促销的对象
    // if (!this.detail.promotionMap) return false;
    // let keysArr = Object.keys(this.detail.promotionMap);
    // if (keysArr.length === 0) return false;
    // for (let i = 0; i < keysArr.length; i++) {
    //   let key = keysArr[i].split("-")[0];
    //   if (key === "COUPON") {
    //     this.promotionMap[key].push(this.detail.promotionMap[keysArr[i]]);
    //   } else {
    //     this.promotionMap[key] = this.detail.promotionMap[keysArr[i]];
    //   }
    // }
    // },
    swiperGoodsImg() {
      this.imgList = this.skuDetail.pics && this.skuDetail.pics.split(",");
      console.log(this.imgList);
      // this.skuDetail.pics.forEach((e) => {
      //   if (e.specName === "images") {
      //     this.imgList = e.specImage;
      //   }
      // });
    },
  },
  mounted() {
    // 用户登录才会判断是否收藏
    // if (this.Cookies.getItem("userInfo")) {
    //   isCollection("GOODS", this.skuDetail.id).then((res) => {
    //     if (res.success && res.result) {
    //       this.isCollected = true;
    //     }
    //   });
    // }

    this.goodsId = this.$route.query.goodsId;
    this.userInfo =
      (this.Cookies.getItem("userInfo") &&
        JSON.parse(this.Cookies.getItem("userInfo"))) ||
      {};
    console.log(this.userInfo, "-----------");
    if (this.userInfo.userId) {
      this.isLogin = true;
    } else {
      this.isLogin = false;
    }
    // this.promotion();
    document.title = this.skuDetail.goodsName;
  },
};
</script>

<style scoped lang="scss">
/******************商品图片及购买详情开始******************/
.item-detail-see {
  width: 175px;
  margin-left: 30px;
}
.flex {
  display: flex;
}
.inventory {
  padding-left: 4px;
}

.wrapper {
  @include white_background_color();
}

.item-num {
  text-align: center;
  width: 100px;
}
.item-price-num {
  font-size: 16px;
  color: #666;
}

.item-detail-show {
  max-width: 1440px;
  margin: 0 auto;
  padding: 30px;
  display: flex;
  flex-direction: row;
}

.item-detail-left {
  width: 40%;
  margin-right: 30px;
}

.item-detail-big-img {
  width: 522px;
  height: 522px;
  // box-shadow: 0px 0px 8px $border_color;
  border: 1px solid #e4e4e4;
  border-radius: 6px;
  cursor: pointer;
}
#dplayer {
  width: 100%;
  height: 100%;
}
.item-detail-big-img img {
  width: 100%;
}

.item-detail-img-row {
  margin-top: 15px;
  display: flex;
}

.item-detail-img-small {
  width: 68px;
  height: 68px;
  box-shadow: 0px 0px 8px #ccc;
  cursor: pointer;
  margin-left: 5px;
}

.item-detail-img-small img {
  height: 100%;
  width: 100%;
}

/*商品选购详情*/
.item-detail-right {
  flex: 1;
  // display: flex;
  // flex-direction: column;
}

.item-detail-title p {
  @include content_color($light_content_color);
  font-weight: bold;
  font-size: 20px;
  padding: 8px 0;
}

.item-detail-express {
  font-size: 14px;
  padding: 2px 3px;
  border-radius: 3px;
  background-color: $theme_color;
  color: #fff;
}

/*商品标签*/
.item-detail-tag {
  padding: 8px 0;
  font-size: 12px;
  color: $theme_color;
}

/*价格详情等*/
.item-detail-price-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.item-price-left {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.item-price-title {
  color: #999999;
  font-size: 14px;
  margin-right: 15px;
}

.item-price-row {
  margin: 5px 0px;
}

.item-price {
  color: $theme_color;
  font-size: 20px;
  cursor: pointer;
}
.item-price-old {
  color: gray;
  text-decoration: line-through;
  font-size: 14px;
  margin-left: 5px;
}

.item-price-coupon-row {
  display: flex;
  align-items: center;
  margin: 5px 0px;
}

.Ellipsis {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2; //控制显示几行
  -webkit-box-orient: vertical; //webbox方向
}

.dropdown {
  position: relative;
  display: inline-block;
  cursor: pointer;
  z-index: 999;
}

.dropdown .item-coupon {
  display: flex;
  align-content: center;
  align-items: center;
  color: $theme_color;
  margin: 5px 0;
  font-size: 12px;
  background-color: #ffdedf;
  border: 1px dotted $theme_color;
  cursor: pointer;

  span {
    padding: 3px;
  }
}
.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  padding: 12px 16px;
}
.dropdown:hover .dropdown-content {
  display: block;
}

.item-coupon {
  margin-right: 5px;
  padding: 0 5px;
  color: $theme_color;
  font-size: 12px;
  background-color: #ffdedf;
  border: 1px dotted $theme_color;
  cursor: pointer;

  span {
    padding: 3px;
  }
}
.item-promotion {
  margin-right: 5px;
  padding: 3px;
  color: $theme_color;
  font-size: 12px;
  border: 1px solid $theme_color;
}

.item-price-right {
  display: flex;
  align-content: center;
  align-items: center;
}

.item-remarks-sum {
  width: 70px;
  text-align: center;
  padding: 0 10px;
  border-left: 1px solid $border_color;
}

.item-remarks-sum p {
  color: #999999;
  font-size: 12px;
  line-height: 10px;
  text-align: center;
}

.item-remarks-num {
  line-height: 18px;
  color: #005eb7;
}

.item-select {
  display: flex;
  flex-direction: row;
}

.item-select-title {
  @include content_color($light_content_color);
  font-size: 14px;
  margin-right: 15px;
  width: 120px;
}

.item-select-column {
  display: flex;
  flex-wrap: wrap;
  flex: 1;
  margin-top: 10px;
}

.item-select-row {
  margin-bottom: 8px;
}

.item-select-box {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.item-select-box {
  padding: 5px;
  margin-right: 8px;
  @include background_color($light_background_color);
  border: 0.5px solid $border_color;
  cursor: pointer;
  @include content_color($light_content_color);
}

.item-select-box:hover {
  border: 0.5px solid $theme_color;
}

.item-select-box-active {
  border: 0.5px solid $theme_color;
}

.item-select-intro p {
  margin: 0px;
  padding: 5px;
}

.add-buy-car-box {
  width: 100%;
  margin-top: 15px;
}

.add-buy-car {
  display: flex;
  align-items: center;
  margin-top: 15px;
}

.goodsConfig {
  display: flex;
  justify-content: space-between;
  > span {
    padding-right: 10px;
    &:hover {
      cursor: pointer;
      color: $theme_color;
    }
  }
}
.sell-point {
  font-size: 12px;
  color: red;
  margin-bottom: 5px;
}
.view-video {
  cursor: pointer;
}

/******************商品图片及购买详情结束******************/
.content {
  padding-left: 30px;

  img {
    margin-top: 10px;
    display: inline-block;
    border: 1px solid #aaa;
    &:hover {
      border: 1px solid red;
    }
  }
}
.swiper-container {
  width: 522px;
  margin-left: 0px;
  margin-right: 0px;
  background-color: #fff;
}
.swiper-button-prev,
.swiper-button-next {
  // background: #666;
  width: 25px;
  height: 35px;
  line-height: 80px;
  font-size: 30px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.swiper-button-prev:hover,
.swiper-button-next:hover {
  background: #fff;
}
.swiper-button-prev {
  left: 0;
  top: 30%;
  padding-right: 10px;
  background: none;
  color: #666;
  background: #fff;
  height: 100%;
}
.swiper-button-next {
  right: 0;
  top: 30%;
  padding-left: 10px;
  color: #666;
  background: #fff;
  height: 100%;
}

.swiper-button-next.swiper-button-disabled {
  background: #fff;
  color: #aaa;
}
.swiper-button-prev.swiper-button-disabled,
.swiper-button-next.swiper-button-disabled {
  opacity: 1 !important;
}
.rate-box {
  margin-left: 10px;
}
.rate-text {
  color: #249fec;
  font-size: 14px;
  vertical-align: middle;
}
.skys-item {
  font-size: 13px;
  padding: 0 15px;
  height: 30px;
  text-align: center;
  margin: 5px 10px 5px 0;
  cursor: pointer;
  color: #000;
  border-radius: 3px;
  border: 1px solid #e4e4e4;
  &:hover {
    color: #000;
    border: 1px solid #f84c4c;
  }
}
.active {
  border: 1px solid #fd2222;
  background: #fff1f1;
  color: #fd2222;
  &:hover {
    color: #fd2222;
  }
}
.goods-total {
  font-size: 20px;
  font-weight: 700;
  color: #fd2222;
}
.goods-total-disable {
  color: #c1c1c1;
}
.item-select-undisable {
  border: 1px solid #8b8b8b;
  background: #ebebeb;
  color: #000;
  cursor: initial;
  &:hover {
    color: #000;
    background: #ebebeb;
    border: 1px solid #8b8b8b;
  }
}
.wholesale {
  background-color: #f6f6f6;
  padding: 10px 20px 10px 10px;
}
.wholesale-box {
  background-color: #f6f6f6;
  border-radius: 5px;
  height: 94px;
  margin-top: 10px;
  margin-bottom: 10px;
  .wholesale-item {
    width: 120px;
    height: 94px;
    box-sizing: border-box;
    padding: 10px 10px 10px 0;
    border-radius: 5px;
    margin-bottom: 10px;
    position: relative;
    margin-right: 22px;
    float: left;
    cursor: pointer;
    &::after {
      position: absolute;
      right: 0;
      top: 50%;
      content: "";
      width: 1px;
      height: 80%;
      transform: translateY(-50%);
      background-color: #ddd;
    }
  }
  .wholesale-item-content {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }
  .wholesale-item-price {
    font-size: 16px;
    margin-bottom: 5px;
    font-weight: 700;
  }
  .wholesale-item-price-active {
    color: #f84c4c;
  }
  .wholesale-item-number {
    font-size: 14px;
  }
}
.buy-now {
  font-size: 16px;
  font-weight: 700;
  height: 50px;
  border: none;
  border-radius: 5px;
  width: 200px;
  color: #fff;
  background-color: red;
  border-color: red;
}
.add-to-cart {
  margin-left: 20px;
  font-size: 16px;
  font-weight: 700;
  height: 50px;
  border: none;
  border-radius: 5px;
  width: 200px;
  color: #fff;
  background-color: #ff9934;
  border-color: #ff9934;
}
.disable-add-cart {
  background-color: #c1c1c1;
  // 鼠标禁用
  cursor: not-allowed;
}
</style>
