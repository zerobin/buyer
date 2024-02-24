<template>
  <div
    class="cate-nav"
    :class="{ 'fixed-show': useClass == 'fixed-show' }"
    :style="{ maxWidth: '1920px', margin: '0 auto', background: ' #000' }"
  >
    <div
      class="cate-nav-wrap"
      :style="{ maxWidth: '1440px', margin: '0 auto', boxSizing: 'border-box' }"
    >
      <div
        class="nav-con"
        :class="{ 'background-white': useClass == 'background-white' }"
      >
        <div
          class="all-categories hover-pointer"
          @mouseenter="showFirstLists"
          @mouseleave="
            showFirstList = false;
            showMask = false;
          "
        >
          <i class="iconfont icon-unorderedlist"></i>
          Product Category
          <i class="iconfont icon-arrow-down"></i>
        </div>
        <ul class="nav-item" v-if="showNavBar">
          <li
            class="nav-lis flex flex-a-c flex-j-c"
            v-for="(item, index) in navList.list"
            :key="index"
            @click="linkTo(item)"
          >
            <img
              class="coupon"
              v-if="item.name === 'COUPONS'"
              :src="require('@/assets/images/coupon.gif')"
            />
            {{ item.name }}
          </li>
        </ul>
      </div>
      <!-- 全部商品分类 -->
      <div
        class="cate-list"
        v-show="showAlways || showFirstList"
        @mouseenter="showFirstList = true"
        @mouseleave="showFirstList = false"
      >
        <!-- 第一级分类 -->
        <div
          ref="nav"
          class="nav-side"
          @mouseleave="
            // panel = false;
            showMask = false
          "
        >
          <ul>
            <li
              v-for="(item, index) in cateList"
              :key="index"
              @mouseenter="showDetail(index)"
              @mouseleave="handleMouseLeave"
              :class="{ active: index === activeIndex }"
            >
              <i class="iconfont icon-a-iPhone8beifen8"></i>
              <span
                class="nav-side-item nav-side-item-wrap"
                @click="goGoodsList(item.category.id, item.category.level)"
                >{{ item.category.name }}</span
              >
              <i class="iconfont icon-a-iPhone8beifen8 icon-right"></i>
            </li>
          </ul>
        </div>
        <!-- 展开分类 -->
        <div
          class="detail-item-panel"
          :style="{ minHeight: '540px' }"
          v-show="panel"
          @mouseenter="handleMouseEnter"
          @mouseleave="
            panel = false;
            showMask = false;
          "
        >
          <ul class="clearfix">
            <li
              v-for="(items, index) in panelData"
              :key="index"
              class="detail-item-row"
            >
              <span
                class="detail-item-title"
                @click="goGoodsList(items.category.id, items.category.level)"
              >
                {{ items.category.name }}
                <Tag
                  color="error"
                  v-if="items.type === 'hot'"
                  style="margin-left: 5px"
                  >HOT</Tag
                >
                <Tag
                  color="green"
                  v-if="items.type === 'new'"
                  style="margin-left: 5px"
                  >NEW</Tag
                >
                <Tag color="error" style="margin-left: 5px">HOT</Tag>
              </span>
              <div>
                <span
                  v-for="(item, subIndex) in items.subCategories"
                  @click="goGoodsList(items.category.id)"
                  :key="subIndex"
                  class="detail-item"
                  >{{ item.category.name }}
                  <Tag
                    color="error"
                    v-if="items.type === 'hot'"
                    style="margin-left: 5px"
                    >HOT</Tag
                  >
                  <Tag
                    color="green"
                    v-if="items.type === 'new'"
                    style="margin-left: 5px"
                    >NEW</Tag
                  >
                  <Tag color="green" style="margin-left: 5px">NEW</Tag>
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="mask" v-show="showMask"></div>
  </div>
</template>

<script>
import { getCategory } from "@/api/goods";
import storage from "@/plugins/storage.js";
export default {
  name: "GoodsListNav",
  props: {
    showAlways: {
      // 总是显示下拉分类
      default: false,
      type: Boolean,
    },
    showNavBar: {
      // 显示全部商品分类右侧导航条
      default: true,
      type: Boolean,
    },
    hover: {
      default: false,
      type: Boolean,
    },
    large: {
      // 是否更高的高度
      default: false,
      type: Boolean,
    },
    opacity: {
      // 是否背景透明
      default: false,
      type: Boolean,
    },
    useClass: {
      type: null,
      default: "",
    },
  },
  data() {
    return {
      activeIndex: 0,
      panel: false, // 二级分类展示
      panelData: [], // 二级分类数据
      showFirstList: false, // 始终展示一级列表
      cateList: [], // 商品分类
      showMask: false,
    };
  },
  computed: {
    navList() {
      // 导航列表
      return {
        list: [
          {
            name: "BEST SELLERS",
            url: { path: "/goodsList", query: { custType: 1 } },
          },
          {
            name: "NEW ARRIVALS",
            url: { path: "/goodsList", query: { custType: 2 } },
          },
          // {
          //   name: "LOYALTY STORE",
          //   url: "/loyalty-store",
          // },
          // {
          //   name: "WHOLESALE",
          //   url: "/wholesale",
          // },
          // {
          //   name: "COUPONS",
          //   url: "/cupon",
          // },
        ],
      };
      // if (storage.getItem("navList")) {
      //   return JSON.parse(storage.getItem("navList"));
      // } else {
      //   return [];
      // }
    },
  },
  methods: {
    linkTo(item) {
      this.$router.push(item.url);
    },
    handleMouseEnter() {
      this.panel = true;
      this.showMask = true;
      //
    },
    handleMouseLeave() {},
    handleMouseLeave() {},
    showFirstLists() {
      this.showFirstList = true;
      this.showMask = true;
      if (
        localStorage.getItem("category") &&
        localStorage.getItem("category_expiration_time")
      ) {
        // this.getCate();
        // 如果缓存过期，则获取最新的信息
        if (new Date() > localStorage.getItem("category_expiration_time")) {
          this.getCate();
          return;
        }
        this.cateList = JSON.parse(localStorage.getItem("category"));
      } else {
        this.getCate();
      }
    },
    getCate() {
      // 获取分类数据
      if (this.hover) return false;
      getCategory().then((res) => {
        console.log(res, "--------------");
        if (res.code === 200) {
          this.cateList = res.data;
          this.$store.commit("SET_CATEGORY", this.cateList);
          // 过期时间
          // var expirationTime = new Date().setHours(new Date().getHours() + 1);
          // // 存放过期时间
          // localStorage.setItem("category_expiration_time", expirationTime);
          // // 存放分类信息
          // localStorage.setItem("category", JSON.stringify(this.cateList));
        }
      });
    },
    showDetail(index) {
      // 展示全部分类
      this.panel = true;
      this.showMask = true;
      this.panelData = this.cateList[index].subCategories;
      this.activeIndex = index;
    },
    goGoodsList(categoryId, level) {
      let routerUrl = this.$router.resolve({
        path: "/goodsFilter",
        query: { categoryId, level },
      });
      window.open(routerUrl.href, "_blank");
    },
  },
  mounted() {
    // if (
    //   localStorage.getItem("category") &&
    //   localStorage.getItem("category_expiration_time")
    // ) {
    //   console.log(111);
    //   // 如果缓存过期，则获取最新的信息
    //   if (new Date() > localStorage.getItem("category_expiration_time")) {
    //     this.getCate();
    //     return;
    //   }
    //   this.cateList = JSON.parse(localStorage.getItem("category"));
    // } else {
    this.getCate();
    // }
  },
};
</script>

<style scoped lang="scss">
.background-white {
  background: #fff;
}
.nav-lis:hover {
  color: $theme_color !important;
  cursor: pointer;
}
.nav-lis {
  text-align: center;
  position: relative;
  margin: 0 30px;
}
.fixed-show {
  margin-top: 0 !important;
  > .nav-con {
    > .all-categories {
      align-items: center !important;
      height: 60px;
      display: inherit;
      justify-content: center;
      padding: 0 !important;
    }
  }
}
.coupon {
  position: absolute;
  left: -51px;
  top: 2px;
  margin-right: 5px;
  height: 32px;
}
.cate-nav {
  position: relative;
}
.hover-pointer {
  &:hover {
    .icon-arrow-down {
      transform: rotate(180deg);
      transition: all 0.2s ease-out;
    }
  }
}
/** 商品分类 */
.nav-con {
  height: 40px;
  margin: 0 auto;
  display: flex;

  .all-categories {
    background: red;
    width: 250px;
    line-height: 40px;
    border-bottom: none;
    font-size: 14px;
    font-weight: 700;
    color: #fff;
    letter-spacing: 0px;
    position: relative;
    z-index: 1001;
  }
  .icon-unorderedlist {
    margin: 0 10px;
  }
  .icon-arrow-down {
    position: absolute;
    right: 10px;
  }
  .nav-item {
    width: 914px;
    height: 46px;
    border-radius: 10px;
    margin-left: 10px;
    line-height: 46px;
    overflow: hidden;
    list-style: none;
    // background-color: #eee;
    display: flex;
    li {
      float: left;
      font-size: 14px;
      font-weight: normal;
      color: #fff;
      position: relative;

      &:hover {
        color: red;
      }
    }
  }
}
// 分类列表
.cate-list {
  margin: 0 auto;
  position: absolute;

  z-index: 1000;
}

.nav-side {
  width: 250px;
  color: #666;
  float: left;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.85);
  height: 540px;
}
.large-nav {
  height: 470px;
  ul > li {
    line-height: 20px;
  }
}
.opacity-nav {
  background-color: rgba(0, 0, 0, 0.5);
}
.nav-side ul {
  width: 100%;
  list-style: none;
}
.nav-side li {
  padding: 0 0 0px 10px;
  cursor: pointer;
  font-size: 13px;
  line-height: 40px;
  position: relative;
  &:hover {
    background-color: #fff;
    span.nav-side-item-wrap,
    i {
      margin-left: 10px;
      transition: all 0.5s;
      color: red;
    }
    i.icon-right {
      right: 10px;
    }
  }
}
li.active {
  background-color: #fff;
  span.nav-side-item-wrap,
  i {
    margin-left: 10px;
    transition: all 0.5s;
    color: red;
  }
  i.icon-right {
    right: 10px;
  }
}
.nav-side-item-wrap {
  margin: 0 0 0 10px;
  font-size: 14px;
}
.nav-side-item:hover {
  cursor: pointer;
  color: $theme_color;
}

/*显示商品详细信息*/
.detail-item-panel {
  width: 1190px;
  min-height: 540px;
  background-color: #fff;
  position: absolute;
  top: 0;
  left: 250px;
  z-index: 1000;
  padding: 15px;
}
.nav-detail-item {
  margin-top: 5px;
  margin-bottom: 15px;
  cursor: pointer;
  color: #eee;
}
.nav-detail-item span {
  padding: 3px 5px;
  background-color: #999;
  color: #fff;
  margin-right: 10px;
  border-radius: 5px;
}
.nav-detail-item span:hover {
  background-color: $theme_color;
  color: #fff;
}
.detail-item-panel li {
  line-height: 30px;
}
.detail-item-title {
  cursor: pointer;
  line-height: 40px;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #000;
  font-weight: 700;
  font-size: 14px;
}
.detail-item-title:hover {
  color: red;
}
.detail-item-row {
  margin-right: 20px;
  float: left;
  width: 21%;
}
.detail-item {
  display: block;
  line-height: 30px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12px;
  cursor: pointer;
  font-weight: 700;
}
.detail-item:hover {
  color: $theme_color;
}
.mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}
.icon-right {
  position: absolute;
  right: 20px;
}
.clearfix:after {
  clear: both;
  content: "";
  display: block;
  height: 0;
  overflow: hidden;
  visibility: hidden;
}
</style>
