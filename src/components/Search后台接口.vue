<template>
  <div class="navbar" :class="{ 'small-search-box': useClass == 'fixed-show' }">
    <div class="container width_1450_auto flex flex-a-c">
      <img
        :src="$store.state.logoImg"
        v-if="showLogo"
        class="logo-img"
        alt=""
        @click="$router.push('/')"
      />
      <div
        :class="{ 'small-search-box': useClass == 'fixed-show' }"
        class="search-box"
      >
        <Dropdown
          placement="bottom-start"
          trigger="custom"
          :visible="searchVisible"
        >
          <Input
            v-model="searchData"
            size="large"
            class="search"
            placeholder="search"
            @keyup.enter.native="handleSearchProduct(searchData)"
            @blur="searchBlur"
            @focus="searchBlur"
          >
            <div
              class="search-icon"
              slot="append"
              @click.stop="handleSearchProduct(searchData)"
            >
              <!-- <Icon type="ios-search" size="21" /> -->
              <i class="iconfont icon-search"></i>
            </div>
          </Input>
          <!-- </router-link> -->
          <DropdownMenu slot="list">
            <div
              class="shopping-cart-null"
              style="width: 420px"
              v-show="searchList.length <= 0"
            >
              <p style="padding: 10px 20px; text-align: left">
                Sorry,nothing found for {{ searchData }}
              </p>
            </div>
            <div
              class="shopping-cart-list"
              style="width: 420px"
              v-show="searchList.length > 0"
            >
              <div style="height: 210px; overflow-y: auto">
                <div
                  class="shopping-cart-box"
                  style="border-bottom: 1px solid #e4e4e4; cursor: pointer"
                  v-for="(item, index) in searchList"
                  @click="goToGoodDedtailPage(item.skuId, item.goodsId)"
                  :key="index"
                >
                  <div class="common-header-cart-card">
                    <div class="shopping-cart-img fl">
                      <img
                        :src="item && item.pics && item.pics.split(',')[0]"
                        class="hover-pointer"
                      />
                    </div>
                    <div
                      class="cart-words"
                      style="
                        width: 295px;
                        display: flex;
                        width: 295px;
                        align-items: center;
                      "
                    >
                      <div
                        style="
                          display: flex;
                          flex-direction: column;
                          flex: 1;
                          width: inherit;
                        "
                      >
                        <div
                          class="cart-list-item-a line-hidden2"
                          style="min-height: inherit"
                        >
                          <p class="hover-pointer goods-title ellipsis">
                            {{ item.goodsName }}
                          </p>
                        </div>
                        <p>{{ item.intro }}</p>
                        <div class="clearfix type-price margin-t20">
                          <div class="price color-f0 fl">
                            <span class="shopping-cart-text">
                              {{ item.price | unitPrice("$") }}</span
                            >
                          </div>
                        </div>
                      </div>
                      <div class="price fr in-stock">In Stock</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DropdownMenu>
        </Dropdown>

        <template>
          <!-- <div v-if="promotionTags.length === 0"></div>
          <div v-else class="history-list flex">
            <div v-for="(item, index) in promotionTags" :key="index">
              <span v-if="index !== 0" class="history-item-line">|</span>
              <span class="history-item" @click="selectTags(item)">{{
                item
              }}</span>
            </div>
          </div> -->
        </template>
      </div>
      <!-- 登录，购物车 -->
      <div class="head-main-right fr size14" v-if="userInfo.nickName">
        <Dropdown trigger="click" style="margin-left: 20px">
          <span class="sign-in">
            <img src="../assets/images/avatar.png" alt="" />
            <span style="vertical-align: top">{{ userInfo.nickName }}</span>
          </span>
          <template #list>
            <DropdownMenu>
              <DropdownItem @click.native="goto('/home/MyOrder')"
                >My Orders</DropdownItem
              >
              <DropdownItem>My Coupons</DropdownItem>
              <DropdownItem>My Address</DropdownItem>
              <DropdownItem @click.native="signOut">Sign out</DropdownItem>
            </DropdownMenu>
          </template>
        </Dropdown>

        <Dropdown placement="bottom-end" trigger="click">
          <!-- <router-link to="/cart" target="_blank"> -->
          <span class="shop-car" @mouseenter="getCartList">
            <i class="iconfont icon-gouwuche"></i>
            <Badge :count="+cartNum < 100 ? +cartNum : 99"
              ><span>Cart</span></Badge
            >
          </span>
          <!-- </router-link> -->
          <DropdownMenu slot="list">
            <div
              class="shopping-cart-null"
              style="width: 340px"
              v-show="shoppingCart.length <= 0"
            >
              <p style="padding: 10px 20px; text-align: left">
                Shopping cart is empty ! Go shopping !~
              </p>
            </div>
            <div class="shopping-cart-list" v-show="shoppingCart.length > 0">
              <div style="height: 160px; overflow-y: auto">
                <div
                  class="shopping-cart-box border-t-e4"
                  v-for="(item, index) in shoppingCart"
                  @click="goToCartPage"
                  :key="index"
                >
                  <div class="common-header-cart-card">
                    <div class="shopping-cart-img fl">
                      <img
                        :src="
                          item &&
                          item.goodsPicUrl &&
                          item.goodsPicUrl.split(',')[0]
                        "
                        class="hover-pointer"
                      />
                    </div>
                    <div class="cart-words fl">
                      <div class="cart-list-item-a line-hidden2">
                        <p class="hover-pointer goods-title ellipsis">
                          {{ item.goodsName }}
                        </p>
                      </div>
                      <div class="clearfix type-price margin-t20">
                        <div class="fl">
                          数量:
                          <span class="shopping-cart-text">{{
                            item.quantity
                          }}</span>
                        </div>
                        <div class="price color-f0 fr">
                          {{ item.amount | unitPrice("$") }}
                        </div>
                        <span
                          class="icon-cursor"
                          @click.stop="deleteCart(item.id)"
                          ><Icon type="ios-close" size="30"
                        /></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="cart-bottom border-t-e4">
                <div class="all-result clearfix pad-ub20">
                  <div class="fl">
                    {{ shoppingCart.length }}
                    <span data-v-8e7b8cc4="">Items</span>
                  </div>
                  <div class="fr color-f0 bold">
                    {{ priceTotal | unitPrice("$") }}
                  </div>
                </div>
                <a rel="nofollow" class="rewa-btn" @click.stop="gotoCart"
                  >View My Cart</a
                >
              </div>
            </div>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div class="head-main-right fr size14" v-else>
        <span class="sign-in" @click="login">
          <i class="iconfont icon-wode"></i>
          <span>Sign in</span>
        </span>
        <span class="shop-car">
          <i class="iconfont icon-gouwuche"></i>
          <span>Cart</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import storage from "@/plugins/storage.js";
import { apiGoodsSearch } from "@/api/goods.js";
import { apiGetShoppingCartList, apiRemoveCart } from "@/api/shoppingCart.js";
export default {
  name: "search",
  props: {
    showTag: {
      // 是否展示搜索栏下方热门搜索
      type: Boolean,
      default: true,
    },
    showLogo: {
      // 是否展示左侧logo
      type: Boolean,
      default: true,
    },
    storeId: {
      // 是否为店铺页面
      type: String,
      default: "",
    },
    hover: {
      type: Boolean,
      default: false,
    },
    useClass: {
      type: null,
      default: "",
    },
  },
  watch: {
    storeId(val) {
      this.onlyStore = val ? true : false;
    },
  },
  computed: {
    // 购物车商品数量
    cartNum() {
      return this.$store.state.cartNum;
    },
    promotionTags() {
      return ["REPART Front Glass", "iphone"];
      // if (this.$store.state.hotWordsList) {
      //   // return JSON.parse(this.$store.state.hotWordsList);
      // } else {
      //   return [];
      // }
    },
  },
  data() {
    return {
      searchVisible: false,
      searchList: [],
      shoppingCart: [],
      userInfo: {}, // 用户信息
      searchData: "", // 搜索内容
      onlyStore: false,
      params: {
        // 请求参数
        pageNumber: 0,
        pageSize: 500,
      },
      total: 0,
    };
  },
  methods: {
    goto(url) {
      this.$router.push(url);
    },
    gotoCart() {
      this.$router.push("/cart");
    },
    deleteCart(cartItemId) {
      apiRemoveCart([cartItemId]).then((res) => {
        if (res.code === 200) {
          this.$Message.success("Deleted successfully~");
          this.getCartList();
        }
      });
    },
    goToCartPage() {
      // 跳转购物车
      let url = this.$router.resolve({
        path: "/cart",
      });
      window.open(url.href, "_blank");
    },
    goToGoodDedtailPage(skuId, goodsId) {
      // 跳转购物车
      let url = this.$router.resolve({
        path: "/goodsDetail",
        query: { skuId, goodsId },
      });
      window.open(url.href, "_blank");
    },
    getCartList() {
      apiGetShoppingCartList(this.params)
        .then((res) => {
          this.total = 0;
          if (res && res.code === 200) {
            this.shoppingCart = res.data;
            this.$store.commit("SET_CARTNUM", this.shoppingCart.length);
            this.Cookies.setItem("cartNum", this.shoppingCart.length);
          } else {
            this.shoppingCart = [];
            this.$store.commit("SET_CARTNUM", 0);
            this.Cookies.setItem("cartNum", 0);
          }
          this.shoppingCart.forEach((item) => {
            this.total += item.quantity * item.amount;
          });
          console.log(res, "cccccccccccccc");
        })
        .catch((err) => {
          this.$store.commit("SET_CARTNUM", 0);
          this.Cookies.setItem("cartNum", 0);
        });
    },
    getShoppingCartList() {
      apiGetShoppingCartList(this.params)
        .then((res) => {
          this.total = 0;
          if (res && res.code === 200) {
            this.shoppingCart = res.data;
            this.shoppingCart.forEach((item) => {
              this.total += item.quantity * item.amount;
            });
            this.$store.commit("SET_CARTNUM", this.shoppingCart.length);
            this.Cookies.setItem("cartNum", this.shoppingCart.length);
          }

          console.log(res, "cccccccccccccc");
        })
        .catch((err) => {
          this.$store.commit("SET_CARTNUM", 0);
          this.Cookies.setItem("cartNum", 0);
        });
    },
    signOut() {
      storage.removeItem("accessToken");
      storage.removeItem("refreshToken");
      storage.removeItem("userInfo");
      storage.removeItem("cartNum");
      this.$store.commit("SET_CARTNUM", 0);
      this.$router.push("/login");
    },
    selectTags(item) {
      // 选择热门标签
      this.searchData = item;
      this.search();
    },
    research() {
      this.onlyStore = !this.onlyStore;
    },
    searchBlur() {
      console.log(111);
      this.searchVisible = false;
    },
    handleSearchProduct(searchVal) {
      // 条件搜索
      if (searchVal) {
        this.searchVisible = true;
        apiGoodsSearch({ goodsName: searchVal }).then((res) => {
          if (res.code === 200) {
            this.$set(this, "searchList", res.data);
            this.searchList = res.data;
            console.log(this.searchList, "==");
          } else {
            this.searchList = [];
          }
          // storage.setItem("hotWordsList", res.result);
        });
      } else {
        // 全平台搜索商品
        // const url = this.$route.path;
        // if (url == "/goodsList") {
        //   this.$emit("search", this.searchData);
        // } else {
        //   const pushData = {
        //     path: "/goodsList",
        //     query: { keyword: this.searchData },
        //   };
        //   if (this.storeId && this.onlyStore)
        //     pushData.query.storeId = this.storeId;
        //   this.$router.push(pushData);
        // }
      }
    },
    searchStore() {
      // 店铺搜索商品
      this.$emit("search", this.searchData);
    },
    login() {
      this.$router.push("/login");
    },
  },

  created() {
    this.searchData = this.$route.query.keyword;

    // if (!this.hover) {
    //   // 首页顶部固定搜索栏不调用热词接口
    //   // 搜索热词每5分钟请求一次
    //   const reloadTime = storage.getItem("hotWordsReloadTime");
    //   const time = new Date().getTime() - 5 * 60 * 1000;
    //   if (!reloadTime) {
    //     hotWords({ count: 5 }).then((res) => {
    //       if (res.success && res.result)
    //         storage.setItem("hotWordsList", res.result);
    //     });
    //     storage.setItem("hotWordsReloadTime", new Date().getTime());
    //   } else if (reloadTime && time > reloadTime) {
    //     hotWords({ count: 5 }).then((res) => {
    //       if (res.success && res.result)
    //         storage.setItem("hotWordsList", res.result);
    //     });
    //     storage.setItem("hotWordsReloadTime", new Date().getTime());
    //   }
    // }
  },
  mounted() {
    if (storage.getItem("userInfo")) {
      this.userInfo = JSON.parse(storage.getItem("userInfo"));
      this.getShoppingCartList();
    }
    window.document.addEventListener("click", () => {
      this.searchVisible = false;
    });
  },
};
</script>
<style scoped lang="scss">
.only-store {
  text-align: right;
  color: $theme_color;
  cursor: pointer;
}
.navbar {
  height: 113px;
  background: #fff;
}
.search-icon {
  width: 100%;
  height: 100%;
}
.small-search-box {
  height: 60px;

  margin: 0 !important;
}

.container {
  position: relative;

  height: 100%;
}
/deep/ .ivu-dropdown-menu {
  min-width: inherit;
  li {
    text-align: left;
  }
}
.search {
  width: 480px;
  border-radius: 5px;

  /deep/ .ivu-input.ivu-input-large {
    // border: 1.4px solid $theme_color;
    box-sizing: border-box;
    border-radius: 5px;
    position: relative;
    padding-left: 10px;
    font-size: 14px;
    font-weight: normal;
    height: 37.8px;
    color: #999;
    &:focus {
      box-shadow: none;
    }
  }

  /deep/ .ivu-input:hover {
    border-color: #e4e4e4;
  }
  /deep/ .ivu-input-group-append {
    border-radius: 5px !important;
    cursor: pointer;
    box-sizing: border-box;
    border: 1.4px solid $theme_color;
    width: 56px;
    height: 37.8px;
    position: absolute;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    z-index: 99;
    background-color: $theme_color;
    color: #ffffff;

    button {
      font-size: 14px;
      font-weight: 600;
      line-height: 1;
    }
  }
}
.search-box {
  margin: 0 0 0 13%;
}
.logo-img {
  max-width: 233px;
  cursor: pointer;
}

.store-search {
  width: 55.6px;
  padding: 0 9px;
  border-radius: 0;
  border-radius: 3px;

  &:nth-child(2) {
    width: 55px;
    margin-left: -2px;
    border-radius: 3px;
  }
}

.btn-div {
  position: relative;
  height: 0px;
  top: -38px;
  left: 352px;
}

.history-list {
  // color: #999;
}
.history-item-line {
  color: #999;
  margin: 0 8px;
}
.history-item {
  font-size: 13px;
  font-weight: normal;
  line-height: 16px;
  letter-spacing: 0px;
  color: #999;
  cursor: pointer;
}

.head-main-right {
  flex: 1;
  padding-right: 10px;
  text-align: right;
}
.size14 {
  font-size: 14px;
}
.fr {
  float: right;
}
.icon-search {
  &::before {
    font-size: 23px;
  }
}
.sign-in,
.shop-car {
  vertical-align: middle;
  font-size: 14px;
  cursor: pointer;
  margin-left: 15px;
  &:hover {
    color: red;
  }
  i {
    &::before {
      vertical-align: middle;
      font-size: 26px;
      padding: 0 8px 0 0;
    }
  }
}
.shopping-cart-list {
  text-align: left;
  width: 340px;

  padding-left: 15px;
  padding-right: 15px;
  box-sizing: border-box;
}
.shopping-cart-box {
  padding-top: 10px;
  padding-bottom: 10px;
}
.common-header-cart-card {
  position: relative;
  &::after {
    clear: both;
    content: "";
    display: block;
    height: 0;
    overflow: hidden;
    visibility: hidden;
  }
}
.shopping-cart-img {
  width: 80px;
  height: 80px;
  margin-right: 10px;
  overflow: hidden;
  img {
    object-fit: cover;
  }
}
.cart-words {
  width: 216px;
  position: relative;
}
.cart-list-item-a {
  min-height: 40px;
  display: block;
  width: 180px;
  font-size: 13px;
  color: #444;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  &:hover {
    color: red;
  }
}
.line-hidden2 {
  overflow: hidden;
  text-overflow: ellipsis;
}
.fl {
  float: left;
}
.margin-t20 {
  margin-top: 20px;
}
.fr {
  float: right;
}
.color-f0 {
  color: red;
}
.icon-cursor {
  cursor: pointer;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 10;
  display: block;
  transition: all 1s;
  &:hover {
    color: red;
  }
}
.border-t-e4 {
  border-top: 1px solid #e4e4e4;
}
.cart-bottom {
  padding: 0 0 12px;
}
.pad-ub20 {
  padding-top: 20px;
}
.pad-b20,
.pad-ub20 {
  padding-bottom: 20px;
}
.rewa-btn {
  display: block;
  width: 100%;
  height: 40px;
  background-color: red;
  color: #fff;
  border-radius: 5px;
  text-align: center;
  line-height: 40px;
}
.bold {
  font-weight: 700;
}
</style>
<style>
::-webkit-scrollbar {
  width: 1px;
  height: 15px;
}
::-webkit-scrollbar-track {
  border-radius: 0;
}
::-webkit-scrollbar-thumb {
  border-radius: 0;
  background: #999;
  transition: all 0.2s;
  border-radius: 5px;
}
::-webkit-scrollbar-thumb:hover {
  background-color: rgba(95, 95, 95, 0.7);
}
.el-loading-parent--relative {
  position: initial !important;
}
.in-stock {
  border: solid 1px #eee;
  padding: 2px 10px;
  border-radius: 10px;
  height: 25px;
}
</style>
