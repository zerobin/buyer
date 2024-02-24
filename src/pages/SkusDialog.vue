<template>
  <div class="skus-dialog">
    <Modal v-model="currentGoodsSkuVisiable" width="850" :mask-closable="false">
      <template #header>
        <p style="text-align: center; font-size: 14px">Edit</p>
      </template>
      <div style="text-align: center">
        <div class="clearfix">
          <div class="el-image fl img_wrap" style="width: 80px; height: 80px">
            <img
              :src="
                activeGoods.goodsPicUrl && activeGoods.goodsPicUrl.split(',')[0]
              "
              class="el-image__inner"
            />
          </div>
          <div class="fr goods-sku clearfix">
            <div class="item-detail-title">
              <p>
                {{ skuDetail.name }}
              </p>
            </div>

            <div class="sell-point">
              {{ skuDetail.sellingPoint }}
            </div>

            <div class="item-detail-price-row">
              <div class="item-price-left">
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
                        v-for="(item, index) in skuDetail.skus[
                          this.matchingIndex
                        ].stepPrices"
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
              </div>
            </div>
            <div class="item-select-column">
              <div class="item-select-title">
                <p>skus</p>
              </div>
              <div style="width: 75%" class="item-select">
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
                    controls-outside
                    :min="1"
                    :max="skuDetail.quantity"
                    :disabled="skuDetail.quantity === 0"
                    v-model="count"
                    :precision="0.1"
                    @on-change="changeCount"
                  ></InputNumber>
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
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <p style="text-align: center">
          <Button
            size="large"
            style="width: 180px"
            :loading="loading"
            @click="cancel"
            >Cancel</Button
          >
          <Button
            type="error"
            size="large"
            style="width: 180px"
            :loading="loading"
            @click="confirm"
            >Confirm</Button
          >
        </p>
      </template>
    </Modal>
  </div>
</template>

<script>
import {
  apiGetShoppingCartList,
  apiRemoveCart,
  addOrUpdateShoppingCart,
} from "@/api/shoppingCart.js";
import { goodsSkuDetail } from "@/api/goods";
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  name: "SkuDialog",
  props: {
    // 显示隐藏
    goodsSkuVisiable: {
      type: Boolean,
      default: false,
    },
    // 商品详情
    goods: {
      type: Object,
      default: () => {},
    },
    activeGoods: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    ...mapState({
      cartList: (state) => state.cartList,
    }),
    ...mapGetters(["getCartList", "cartNum", "priceTotal", "checkedTotal"]),
    currentGoodsSkuVisiable: {
      get() {
        return this.goodsSkuVisiable;
      },
      set(val) {
        this.$emit("update:goodsSkuVisiable", val);
      },
    },
  },
  watch: {
    amount(val) {
      console.log(val, "======================");
    },
    goods: {
      handler(val) {
        if (val) {
          this.skuDetail = JSON.parse(JSON.stringify(val));
          this.extractSpecList(); // 在组件加载完成后调用该方法
          this.formatButtonText();
          let index =
            this.skuDetail &&
            this.skuDetail.skus &&
            this.skuDetail.skus.findIndex((item, index) => {
              return item.id === this.activeGoods.skuId;
            });
          this.selectSku(index);
          console.log(index, this.skuDetail, this.activeGoods, "cc0000000000");
          this.count = this.activeGoods.quantity;
          this.amount = this.activeGoods.amount;
          this.changeCount(this.count);
        }
      },
      deep: true,
      immediate: true,
    },
  },
  components: {},
  data() {
    return {
      amount: 0,
      userInfo: {},
      skuType: {},
      active: 0,
      matchingIndex: 0,
      wholesaleActive: 0,
      count: 1,
      skuDetail: {
        skus: [],
      }, // sku详情
      checkedNum: 0, // 选中数量
      allChecked: false, // 全选
      loading: false, // 加载状态
      loading1: false, // 加入购物车loading
      // couponList: [], // 优惠券列表
      total: 0,
      params: {
        // 请求参数
        pageNumber: 0,
        pageSize: 500,
      },
      goodDetail: {},
    };
  },
  methods: {
    ...mapActions([
      "DELETE_PRODUCT",
      "DELETE_ALL_PRODUCT",
      "UPDATE_CARTLIST_CHECKED",
      "UPDATE_PRODUCT",
    ]),
    selectWholesale(index, numFrom) {
      console.log(numFrom, "====aaaaaaa");
      this.wholesaleActive = index;
      this.count = +numFrom;
    },
    selectSku(actIndex) {
      this.active = actIndex;
      this.matchingIndex = actIndex;
      this.changeCount(this.count);
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
        // this.amount = stepPrice.price;
      }
      // this.amount = price;
      return price.toFixed(2);
    },
    changeCount(val) {
      if (
        this.skuDetail &&
        this.skuDetail.skus &&
        this.skuDetail.skus[this.matchingIndex] &&
        this.skuDetail.skus[this.matchingIndex].stepPrices
      ) {
        this.skuDetail.skus[this.matchingIndex].stepPrices.forEach(
          (item, index) => {
            if (item.from <= val && item.to >= val) {
              this.wholesaleActive = index;
              this.amount = item.price;
            }
            if (val > item.to) {
              this.wholesaleActive = index;
              this.amount = item.price;
            }
          }
        );
      }
    },
    cancel() {
      this.$emit("update:goodsSkuVisiable", false);
    },
    confirm() {
      // 判断用户是否登录
      this.updateShoppingCart();
    },
    updateShoppingCart() {
      let skuDesc = "";
      let activedSku = this.skuDetail.skus[this.matchingIndex];
      console.log(this.skuDetail.skus[this.matchingIndex]);
      // 添加购物车
      Object.keys(this.skuType).map((item) => {
        // skuDesc += item + ":" + activedSku[item] + "+ ";
        skuDesc += activedSku[item] + "--";
      });
      console.log(this.skuDetail, this.activeGoods, "---aaaaaaaaaaa");
      const params = {
        goodsPicUrl: this.skuDetail.pics,
        goodsId: this.skuDetail.goodsId,
        goodsName: this.skuDetail.name,
        skuId: this.skuDetail.skus[this.matchingIndex].id,
        skuDesc, //
        userId: this.userInfo.userId,
        quantity: this.count,
        amount: this.amount,
        remark: "",
      };
      this.UPDATE_PRODUCT(params);
      this.$Message.success("edit Success");
      this.$emit("update:goodsSkuVisiable", false);
      this.$emit("updatePage");
      // addOrUpdateShoppingCart(params)
      //   .then((res) => {
      //     this.loading = false;
      //     if (res.code === 200) {
      //       // 显示一个弹出框，提示添加到购物车成功
      //       this.$Message.success("edit Success");
      //       this.$emit("update:goodsSkuVisiable", false);
      //       this.$emit("updatePage");
      //     } else {
      //       this.$Message.error(res.msg);
      //     }
      //   })
      //   .catch(() => {
      //     this.loading = false;
      //   });
    },
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
      console.log(this.skuDetail.skus, "000000000000000000");
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
      // this.skuType = this.transformSkuType(this.skuType);
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
    // 获取商品详情
    getGoodDetail(goodsId) {
      this.isLoading = true;
      goodsSkuDetail({ goodsId })
        .then((res) => {
          this.isLoading = false;
          if (res.code === 200) {
            this.goodDetail = res.data;
          } else {
            this.$Message.error(res.msg);
            this.isLoading = false;
          }
        })
        .catch((e) => {
          this.isLoading = false;
        });
    },

    // 获取梯度价格索引
    getSelectStepPricesPrice(stepPrices, val) {
      console.log(val, "00000000000");
      let price = 0;
      if (Array.isArray(stepPrices) && stepPrices.length) {
        stepPrices.forEach((item, index) => {
          if (item.from <= val && item.to >= val) {
            price = item.price;
          }
          if (val > item.to) {
            price = item.price;
          }
        });
      }
      return price;
    },
    // 设置购买数量
    async changeNum(goods) {
      let { quantity, goodsId, skuId } = goods;
      if (goods.quantity && goods.goodsId) {
        let res = await goodsSkuDetail({ goodsId });
        if (res.code === 200) {
          this.goodDetail = res.data;
          let filterGoods =
            this.goodDetail.skus &&
            this.goodDetail.skus.filter((item) => {
              return item.id === skuId;
            });
          let selectStepPricesPrice = this.getSelectStepPricesPrice(
            filterGoods[0]["stepPrices"],
            quantity
          );
          console.log(selectStepPricesPrice, "000");
          goods.amount = selectStepPricesPrice;
          // 更新一条购物车数据
          await addOrUpdateShoppingCart(goods);
          // 更新页面
          this.getCartList();
        } else {
          this.$Message.error(res.msg);
          this.isLoading = false;
        }
      }
    },

    // 购物车列表
    // async getCartList() {
    // this.loading = true;
    // this.total = 0;
    // try {
    //   let res = await apiGetShoppingCartList(this.params);
    //   this.loading = false;
    //   if (res.code === 200) {
    //     if (this.cartList.length) {
    //       res.data.forEach((item) => {
    //         if (item.id === this.cartList.id) {
    //           item.checked = this.cartList.checked;
    //         }
    //       });
    //     } else {
    //       res.data.forEach((item) => {
    //         item.checked = true;
    //       });
    //     }
    //     this.cartList = res.data;
    //     this.checkedNum = 0;
    //     this.cartList.forEach((item) => {
    //       this.total += item.quantity * item.amount;
    //       if (item.checked) {
    //         this.checkedNum++;
    //       }
    //     });

    //     if (
    //       this.checkedNum === this.cartList.length &&
    //       this.cartList.length
    //     ) {
    //       this.allChecked = true;
    //     } else {
    //       this.allChecked = false;
    //     }
    //     this.$forceUpdate();
    //   }
    // } catch (error) {
    //   this.loading = false;
    // }
    // },
  },
  mounted() {
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
  },
};
</script>

<style scoped lang="scss">
::v-deep .ivu-modal-header {
  border-bottom: none;
}
::v-deep .ivu-modal-footer {
  border-top: none;
}
.clearfix {
  zoom: 1;
  &::after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }
}
.el-image__inner {
  vertical-align: top;
}
.img_wrap {
  border: 1px solid #f6f5fa;
  border-radius: 5px;
}

.el-image {
  position: relative;
  display: inline-block;
  overflow: hidden;
}
.el-image__error,
.el-image__inner,
.el-image__placeholder {
  width: 100%;
  height: 100%;
}

.goods-sku {
  width: calc(100% - 110px);
}

.fr {
  float: right;
}

.fl {
  float: left;
}

.item-detail-title p {
  @include content_color($light_content_color);
  font-weight: bold;
  font-size: 20px;
  padding: 8px 0;
  text-align: left;
}

.sell-point {
  font-size: 12px;
  color: red;
  margin-bottom: 5px;
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
.goods-total {
  font-size: 20px;
  font-weight: 700;
  color: #fd2222;
}
.goods-total-disable {
  color: #c1c1c1;
}
</style>
