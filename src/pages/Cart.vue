<template>
  <div class="cart" @click="couponAvailable = false">
    <!-- <BaseHeader></BaseHeader> -->
    <Search></Search>
    <!-- 商品分类 -->
    <cateNav :showAlways="false"></cateNav>

    <!-- 购物车主体 -->
    <div class="cart-content center">
      <!-- 购物车商品列表 -->
      <div class="cart-goods">
        <div class="cart-goods-title">
          <div class="width_60">
            <Checkbox
              v-model="allChecked"
              @on-change="(status) => changeChecked(status, 'all', getCartList)"
            >
              ` All `
            </Checkbox>
          </div>
          <div class="goods-title">item(s)</div>
          <div class="width_150">Quantity</div>
          <div class="width_150">Price</div>
          <div class="width_200">Operation</div>
        </div>
        <div v-if="getCartList.length === 0" class="cart-empty">
          <p>The shopping cart is empty.</p>
          <router-link to="/">Go shopping.&gt;</router-link>
        </div>
        <div
          v-else
          class="cart-goods-items"
          v-for="(goods, index) in getCartList"
          :key="index"
        >
          <div class="shop-name">
            <div class="goods-item">
              <div class="width_60">
                <Checkbox
                  v-model="goods.checked"
                  @on-change="
                    (status) => changeChecked(status, 'single', goods)
                  "
                ></Checkbox>
              </div>
              <div
                class="goods-title m-l-20"
                @click="goGoodsDetail(goods.goodsId)"
              >
                <img
                  :src="
                    goods.goodsPicUrl.split(',')[0] ||
                    '../assets/images/goodsDetail/item-detail-1.jpg'
                  "
                />
                <div class="m-l-20 flex-column">
                  <p>
                    {{ goods.goodsName }}
                  </p>
                  <Tag style="text-align: left" v-if="goods.skuDesc">
                    {{ goods.skuDesc }}
                  </Tag>
                  <p class="price">{{ goods.amount | unitPrice("$") }}</p>
                </div>
              </div>

              <div class="width_150">
                <InputNumber
                  controls-outside
                  :min="1"
                  v-model="goods.quantity"
                  @on-change="changeNum(goods)"
                ></InputNumber>
              </div>
              <div class="width_150 single-total-price">
                {{ (goods.amount * goods.quantity) | unitPrice("$") }}
              </div>

              <div class="width_200">
                <Button
                  style="margin-right: 10px"
                  size="small"
                  type="info"
                  @click="updateGoods(goods)"
                  >Edit</Button
                >
                <Button size="small" type="primary" @click="delGoods(goods)"
                  >Delete</Button
                >
              </div>
            </div>
          </div>
        </div>
        <!-- 底部支付栏 -->
        <div class="cart-goods-footer">
          <div>
            <div class="width_60">
              <Checkbox
                v-model="allChecked"
                @on-change="
                  (status) => changeChecked(status, 'all', getCartList)
                "
              >
                ` All `
              </Checkbox>
            </div>
            <div class="handle-btn" @click="delGoodsAll">Delete</div>
          </div>
          <div>
            <div class="ml_20 m-r-20 total-price">
              Subtotal:
              <div>{{ this.checkedTotal | unitPrice("$") }}</div>
            </div>
            <div class="pay ml_20" @click="pay">Place Order</div>
          </div>
        </div>
      </div>
      <Spin size="large" fix v-if="loading"></Spin>
    </div>
    <BaseFooter class="footer"></BaseFooter>
    <SkusDialog
      :goodsSkuVisiable.sync="goodsSkuVisiable"
      :goods="goodDetail"
      :activeGoods="goodSku"
    ></SkusDialog>
    <!-- @updatePage="getCartList()" -->
    <Modal v-model="payOrderVisiable" width="850" :mask-closable="false">
      <template #header>
        <p style="text-align: center; font-size: 14px">Place Order</p>
      </template>
      <div>
        <Form
          :model="addressFormData"
          ref="form"
          label-position="left"
          :label-width="80"
          :rules="ruleInline"
        >
          <FormItem label="Address:" prop="id">
            <Select
              v-model="addressFormData.id"
              filterable
              placeholder="address"
              style="width: 400px"
            >
              <Option
                v-for="item in addressList"
                :value="item.id + ''"
                :key="item.id"
                >{{ handleAddress(item.address) }}</Option
              >
            </Select>
            <Button style="margin-left: 10px" type="primary" @click="addAddress"
              >Add Address</Button
            >
          </FormItem>
        </Form>

        <Table :columns="columns" :data="orderTable"></Table>
        <div style="font-size: 16px; margin-top: 10px; text-align: right">
          Subtotal:
          <span style="color: red">
            {{ checkedTotal | unitPrice("$") }}
          </span>
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
import Promotion from "@/components/goodsDetail/Promotion";
import Search from "@/components/Search";
import SkusDialog from "./SkusDialog.vue";
import { mapState, mapActions, mapGetters } from "vuex";

import * as APIMember from "@/api/member";
import { goodsSkuDetail } from "@/api/goods";
import { apiOrderSave } from "@/api/order";
import { apiAddressList } from "@/api/address.js";
export default {
  name: "Cart",
  beforeRouteEnter(to, from, next) {
    window.scrollTo(0, 0);
    next();
  },
  components: {
    Search,
    Promotion,
    SkusDialog,
  },
  computed: {
    ...mapState({
      cartList: (state) => state.cartList,
    }),
    ...mapGetters(["getCartList", "cartNum", "priceTotal", "checkedTotal"]),
  },
  data() {
    return {
      addressFormData: {
        id: null,
      },
      addressList: [],
      ruleInline: {
        id: [
          {
            required: true,
            message: "Please select Address",
            trigger: "change",
          },
        ],
      },
      address: "",
      orderTable: [],
      columns: [
        {
          title: "goodsName",
          key: "goodsName",
        },
        {
          title: "Quantity",
          key: "quantity",
        },
        {
          title: "unitPrice",
          key: "amount",
        },
      ],
      payOrderVisiable: false,
      goodSku: {},
      goodsSkuVisiable: false,
      couponAvailable: false, // 展示优惠券
      goodsTotal: 0, // 商品数量
      someChecked: false, // 至少选中一个
      allChecked: false, // 全选
      loading: false, // 加载状态
      // couponList: [], // 优惠券列表
      priceDetailDTO: {}, // 价格明细
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
    ]),
    addAddress() {
      this.$router.push("/home/MyAddress");
    },
    handleAddress(address) {
      this.address = address;
      return address;
    },
    cancel() {
      this.payOrderVisiable = false;
    },
    async getAddrList() {
      // 获取地址列表
      try {
        let res = await apiAddressList();
        if (res.code === 200) {
          console.log(res.data, "00000000000000ccc");
          this.addressList = res.data;
        }
      } catch (err) {
        console.log(err);
      }
    },
    async confirm() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          let formatDetail = [];
          this.orderTable.forEach((item) => {
            formatDetail.push({
              goodsId: item.goodsId,
              quantity: item.quantity,
              skuId: item.skuId,
              unitPrice: item.amount,
              skuDesc: item.skuDesc,
            });
          });
          let data = {
            addressId: +this.addressFormData.id,
            details: formatDetail,
            orderStatus: 0,
            totalAmount: this.checkedTotal,
          };
          let res = await apiOrderSave(data);
          if (res.code === 200) {
            this.$Message.success("Order submitted successfully");
            this.payOrderVisiable = false;
            this.someChecked = false;
            this.DELETE_ALL_PRODUCT();
          }
        }
      });
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
    // 跳转商品详情
    goGoodsDetail(goodsId) {
      let routeUrl = this.$router.resolve({
        path: "/goodsDetail",
        query: { goodsId },
      });
      window.open(routeUrl.href, "_blank");
    },
    // 删除商品
    delGoods(goods) {
      if (!goods) return;
      this.$Modal.confirm({
        title: "delete",
        content: "<p>Are you sure you want to delete this product?</p>",
        okText: "OK",
        cancelText: "Cancel",
        onOk: () => {
          this.DELETE_PRODUCT(goods);
          this.$Message.success("Deleted successfully~");
        },
      });
    },
    delGoodsAll() {
      this.$Modal.confirm({
        title: "delete",
        content: "<p>Are you sure you want to delete this product?</p>",
        okText: "OK",
        cancelText: "Cancel",
        onOk: () => {
          this.DELETE_ALL_PRODUCT();
          this.$Message.success("Deleted All successfully~");
        },
      });
    },
    // 更新商品
    async updateGoods(goods) {
      let { goodsId, skuId } = goods;
      let res = await goodsSkuDetail({ goodsId });
      if (res.code === 200) {
        this.goodDetail = res.data;
        // let filterGoods =
        //   this.goodDetail.skus &&
        //   this.goodDetail.skus.filter((item) => {
        //     return item.id === skuId;
        //   });
        this.goodSku = goods;
        // console.log(this.goodSku, filterGoods, "000000000000ccc0");
        this.goodsSkuVisiable = true;
      }
    },
    // 跳转支付页面
    pay() {
      if (this.someChecked) {
        this.orderTable = this.cartList.filter((item) => {
          return item.checked;
        });
        this.payOrderVisiable = true;
      } else {
        this.$Message.warning("Please select at least one item");
      }
    },
    // 展示优惠券
    showCoupon(storeId, index) {
      this.couponAvailable = index;
    },
    // 获取梯度价格索引
    getSelectStepPricesPrice(stepPrices, val) {
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
          // await addOrUpdateShoppingCart(goods);
          // 更新页面
          // this.getCartList();
        } else {
          this.$Message.error(res.msg);
          this.isLoading = false;
        }
      }
    },
    // 设置商品选中状态
    /**
     * @param { Boolean } status 选中和不选中
     * @param { string } type // single：单个 all：全部
     * @param { Object| Arrary } data // single：单个的时候是对象 all的时候是数据对象
     */
    async changeChecked(status, type, data) {
      if (type === "all") {
        // 全选
        this.UPDATE_CARTLIST_CHECKED({ data, type, status });
      } else {
        // 单个商品
        this.isAllChecked();
        this.isSomeChecked();
        this.UPDATE_CARTLIST_CHECKED({ data, type, status });
      }
    },
    isAllChecked() {
      this.allChecked = this.getCartList.every((item) => {
        return item.checked;
      });
    },
    isSomeChecked() {
      this.someChecked = this.getCartList.some((item) => {
        return item.checked;
      });
    },
    // 领取优惠券
    async receiveShopCoupon(item) {
      let res = await APIMember.receiveCoupon(item.id);
      if (res.success) {
        this.$set(item, "disabled", true);
        this.$Message.success("领取成功");
      } else {
        this.$Message.error(res.message);
      }
    },
  },
  mounted() {
    // this.getCartList();
    this.isAllChecked();
    this.isSomeChecked();
    this.getAddrList();
  },
};
</script>

<style scoped lang="scss">
.footer {
  margin-top: 10px;
}
/** logo 搜索 start **/
.logo {
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px auto 0;
  div:nth-child(1) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    img {
      width: 150px;
      height: auto;
      cursor: pointer;
    }
    div:nth-child(2) {
      width: 200px;
      color: #999;
      font-size: 16px;
      margin: 0 20px;
      span {
        color: $theme_color;
      }
    }
  }
}
.cart-content {
  max-width: 1450px;
  margin: 20px auto;
  position: relative;
}
/** logo end */
/** step步骤条 */
.cart-steps {
  height: 30px;
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  span {
    @include content_color($light_content_color);
    height: 30px;
    text-align: center;
    line-height: 30px;
    display: inline-block;
    padding: 0 15px;
  }

  .ivu-icon {
    @include content_color($light_content_color);
    font-size: 20px;
    margin: 0 15px;
  }

  .active {
    border-radius: 50px;
    background-color: #ff8f23;
    color: #fff;
  }

  .active-arrow {
    color: #ff8f23;
  }
}
/** 步骤条和配送区域总体 */
.available-area {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}
/** 商品列表 */
.cart-goods {
  &-title {
    height: 50px;
    @include background_color($light_white_background_color);
    @include title_color($title_color);
    border-bottom: 1px solid #e4e4e4;
    display: flex;
    align-items: center;
    padding: 0 20px;
    div {
      text-align: center;
    }
    .goods-title {
      flex: 1;
    }
  }
  .cart-empty {
    width: 100%;
    text-align: center;
    height: 300px;
    padding-top: 100px;
  }
  &-items {
    .goods-title {
      flex: 1;
    }
    .shop-name {
      display: flex;
      align-items: center;
      position: relative;
      // border-bottom: 1px solid #e4e4e4;
      position: relative;
      @include title_color($light_title_color);
      > * {
        width: 50%;
      }
      .go-shop-page:hover {
        color: $theme_color;
        cursor: pointer;
      }
      .customer-service {
        margin-left: 5px;
        color: #fcc217;
        cursor: pointer;
        &:hover {
          color: $theme_color;
        }
      }
      /** 优惠券 */
      .shop-coupon {
        width: 80px;
        height: 24px;
        position: relative;
        background: url(../assets/images/cart-coupon-icons02.png) 0 0 no-repeat;
        > div {
          position: absolute;
          top: 35px;
          left: 0;
          width: 300px;
          height: 300px;
          background-color: #fff;
          border: 1px solid $theme_color;
          // border-radius: 3px;
          z-index: 1;
          padding: 10px 20px;
          &::before {
            content: "";
            display: block;
            background: url(../assets/images/cart-coupon-icons02.png) 0 -58px no-repeat;
            width: 80px;
            height: 12px;
            position: absolute;
            top: -12px;
            left: 0;
          }
          .coupon-item {
            margin-bottom: 10px;
            span:nth-child(1) {
              border: 1px solid #e33937;
              display: inline-block;
              padding: 3px 10px;
              color: $theme_color;
              border-radius: 3px;
            }
            span:nth-child(2) {
              font-size: 12px;
              margin-left: 5px;
              color: #999;
            }
            .coupon-btn {
              height: 26px;
              float: right;
              font-size: 12px;
            }
            &::after {
              display: block;
              content: "";
              clear: right;
            }
          }
        }
      }
      .promotion-notice {
        text-align: right;
        font-size: 12px;
      }
      .shop-coupon-show {
        background-position-y: -34px;
      }
    }
    .goods-item {
      flex: 1;
      position: relative;
      @extend .cart-goods-title;
      @include background_color($light_white_background_color);
      padding: 10px 20px;
      height: auto;
      > div:nth-child(1) {
        width: 30px;
      }
      > div:nth-child(2) {
        cursor: pointer;
        display: flex;
        box-sizing: border-box;
        padding-left: 20px;
        position: relative;
        img {
          width: 70px;
          height: 70px;
        }
        > div > p {
          @include content_color($light_content_color);
          font-size: 13px;
          text-align: left;
          margin-left: 10px;
          &:hover {
            color: $theme_color;
          }
        }
      }
      > div:nth-child(5) {
        font-weight: bold;
      }
      .num-input {
        width: 60px;
        border: 1px solid #999;
        border-radius: 5px;
        padding: 0 5px;
        &:focus {
          outline-color: $theme_color;
        }
      }
    }
    .error-goods {
      position: absolute;
      width: 100%;
      height: 100%;
      margin-left: -20px;
      background-color: rgba($color: #999, $alpha: 0.5);
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-left: 150px;
      color: #000;
      padding-right: 30px;
    }
  }
  &-footer {
    @extend .cart-goods-title;
    position: sticky;
    bottom: 0;
    border-top: 1px solid #ddd;
    margin-top: 10px;
    padding: 0 0 0 20px;
    line-height: 50px;
    justify-content: space-between;
    > div {
      display: flex;
    }
    .selected-count {
      span {
        color: $theme_color;
      }
    }

    .save-price span {
      color: #000;
    }
    .total-price div {
      color: $theme_color;
      font-size: 20px;
    }
    .pay {
      background-color: $theme_color;
      width: 150px;
      font-size: 20px;
      color: #fff;
      height: 100%;
      line-height: 50px;
      cursor: pointer;
    }
  }
  .handle-btn {
    padding: 0 20px;
    font-size: 14px;
    color: #999;
    cursor: pointer;
    &:hover {
      color: $theme_color;
    }
  }
}
.like {
  max-width: 1450px;
  margin: 10px auto;
  // padding: 20px 0;
  @include white_background_color();
}
.likeGoods,
.shop-nav-container {
  max-width: 1450px;
  margin: 0 auto;
}
.width_250 {
  width: 200px;
}
.width_150 {
  width: 150px;
}
.width_60 {
  width: 60px;
}
.promotion {
  display: flex;
  margin-top: 5px;
  margin-left: 5px;
  > span {
    border: 1px solid $theme_color;
    color: $theme_color;
    font-size: 12px;
    border-radius: 2px;
    padding: 0 2px;
  }
  > p {
    font-size: 12px;
    margin-left: 10px;
    color: #999;
  }
}
.cart-goods-footer > div {
  display: flex;
  align-items: center;
  overflow: hidden;
}
.total-price {
  display: flex;
  align-items: center;
}
.m-r-20 {
  margin-right: 20px;
}
.m-l-20 {
  margin-left: 20px;
}
.price {
  color: $theme_color !important;
  font-size: 16px;
}
.flex-column {
  display: flex;
  flex-direction: column;
  justify-content: left;
}
.single-total-price {
  font-size: 16px;
  font-weight: 700;
  color: $theme_color;
}
</style>
<style>
.ivu-input-number-input {
  text-align: center;
}
</style>
