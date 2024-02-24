<!--
 * @Date: 2023-11-19 13:06:03
 * @LastEditors: 庄鸿斌
 * @LastEditTime: 2024-01-27 23:02:24
-->
<template>
  <div class="wrapper">
    <!-- <BaseHeader></BaseHeader> -->
    <Search @search="handleSearch"></Search>
    <!-- 商品分类 -->
    <cateNav :showAlways="false"></cateNav>

    <div class="container">
      <div class="content">
        <div class="left">
          <div
            class="ivu-card ivu-card-dis-hover ivu-card-shadow"
            style="width: 100%; margin-bottom: 10px"
          >
            <div class="ivu-card-head">
              <span class="card-title">Categories</span>
            </div>
            <div class="ivu-card-body">
              <div>
                <p
                  class="gategory-item gategory-level-1"
                  :class="{
                    active:
                      gategoryList.category &&
                      gategoryList.category.id == categoryId,
                  }"
                  @click="
                    filterGoods(
                      gategoryList.category.id,
                      gategoryList.category.level
                    )
                  "
                >
                  {{ gategoryList.category && gategoryList.category.name }}
                </p>
                <div v-if="gategoryList.subCategories">
                  <div
                    v-for="(item, index) in gategoryList.subCategories"
                    :key="index"
                  >
                    <p
                      class="gategory-item gategory-level-2"
                      :class="{
                        active: item.category && item.category.id == categoryId,
                      }"
                      @click="
                        filterGoods(item.category.id, item.category.level)
                      "
                    >
                      {{ item.category.name }}
                    </p>
                    <div v-if="item && item.subCategories">
                      <p
                        v-for="(child, childIndex) in item.subCategories"
                        class="gategory-item gategory-level-3"
                        @click="
                          filterGoods(child.category.id, child.category.level)
                        "
                        :class="{
                          active:
                            child.category && child.category.id == categoryId,
                        }"
                      >
                        {{ child.category && child.category.name }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 品牌 -->
          <Card style="width: 100%; margin-bottom: 10px" :shadow="true">
            <template #title>
              <span class="card-title">Brand</span>
            </template>
            <!-- <template #extra>
              <a href="#" @click.prevent="changeLimit">
                <Icon type="ios-arrow-forward" size="20" color="#86909c" />
              </a>
            </template> -->
            <CheckboxGroup v-model="brands">
              <Checkbox
                :label="item"
                style="display: block"
                v-for="(item, index) in brandList"
                :key="index"
              >
                <span class="fs-14 ml-5">{{ item }}</span>
              </Checkbox>
            </CheckboxGroup>
          </Card>
        </div>
        <!-- 右侧查询商品 -->
        <div class="right">
          <empty v-if="goodsList.length === 0" />
          <goodClassify :paramData="goodsList"></goodClassify>
        </div>
      </div>
      <div class="goods-page">
        <Page
          show-total
          show-sizer
          @on-change="changePageNum"
          @on-page-size-change="changePageSize"
          :total="total"
          :page-size="params.pageSize"
        ></Page>
      </div>
    </div>
    <Spin size="large" fix v-if="loading"></Spin>
    <BaseFooter></BaseFooter>
  </div>
</template>

<script>
import GoodsClassNav from "@/components/nav/GoodsClassNav";
import * as apiGoods from "@/api/goods";
import goodClassify from "@/components/indexDecorate/modelList/goodClassify.vue";
import storage from "@/plugins/storage.js";

export default {
  name: "GoodsList",

  beforeRouteEnter(to, from, next) {
    window.scrollTo(0, 0);
    next();
  },

  data() {
    return {
      categoryId: null,
      level: 0,
      brands: [],
      brandList: [],
      gategoryList: {}, // 分类，树形结构
      categoryBar: [], // 分类
      showCategories: false,
      goodsList: [], // 商品列表
      loading: false, // 加载状态
      total: 0, // 列表总数
      params: {
        // 请求参数
        pageNumber: 0,
        pageSize: 20,
        categoryId: "",
        level: 0,
      },
    };
  },
  watch: {
    $route() {
      this.getGoodsList();
    },
    brands: {
      handler(val) {
        this.getGoodsList();
      },
    },
  },
  methods: {
    filterGoods(categoryId, level) {
      this.categoryId = categoryId;
      this.level = level;
      this.$router.push({
        path: "/goodsFilter",
        query: { categoryId, level },
      });
    },
    toggleCategories() {
      this.showCategories = !this.showCategories;
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
    // 搜索
    handleSearch(key) {
      this.params.keyword = key;
      this.$route.query.keyword = key;
      this.params.pageNumber = 0;
      this.getGoodsList();
    },

    goGoodsDetail(skuId, goodsId) {
      // 跳转商品详情
      let routeUrl = this.$router.resolve({
        path: "/goodsDetail",
        query: { skuId, goodsId },
      });
      window.open(routeUrl.href, "_blank");
    },
    // 分页 修改页码
    changePageNum(val) {
      this.params.pageNumber = val;
      this.getGoodsList();
    },
    // 分页 修改页数
    changePageSize(val) {
      this.params.pageNumber = 1;
      this.params.pageSize = val;
      this.getGoodsList();
    },

    // 获取商品列表
    getGoodsList() {
      this.loading = true;
      this.params.brands = this.brands || [];
      this.params.categoryId = this.categoryId;
      this.params.level = this.level;
      apiGoods
        .goodsFilterList(this.params)
        .then((res) => {
          this.loading = false;
          this.goodsList = res.data || [];
          this.total = res.total;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getGategoryList(categoryId) {
      this.loading = true;
      apiGoods
        .categoryFilterList(categoryId)
        .then((res) => {
          this.loading = false;
          this.gategoryList = res.data || {};
          // this.gategoryList = {
          //   category: {
          //     createBy: "admin",
          //     createTime: "2023-09-20 22:46:22",
          //     updateBy: "",
          //     updateTime: "2023-09-20 14:46:21",
          //     remark: null,
          //     pageNumber: 1,
          //     pageSize: 15,
          //     id: 18,
          //     level: 0,
          //     code: "",
          //     name: "Parts for Apple",
          //     intro: null,
          //     parentId: 0,
          //     sortOrder: 0,
          //   },
          //   subCategories: [
          //     {
          //       category: {
          //         createBy: "admin",
          //         createTime: "2023-09-20 22:47:03",
          //         updateBy: "",
          //         updateTime: "2023-09-20 14:47:03",
          //         remark: null,
          //         pageNumber: 1,
          //         pageSize: 15,
          //         id: 19,
          //         level: 1,
          //         code: "01",
          //         name: "iPhone",
          //         intro: null,
          //         parentId: 18,
          //         sortOrder: 0,
          //       },
          //       subCategories: [
          //         {
          //           category: {
          //             createBy: "admin",
          //             createTime: "2023-09-20 22:47:03",
          //             updateBy: "",
          //             updateTime: "2023-09-20 14:47:03",
          //             remark: null,
          //             pageNumber: 1,
          //             pageSize: 15,
          //             id: 40,
          //             level: 1,
          //             code: "01",
          //             name: "iPhonexxxx",
          //             intro: null,
          //             parentId: 18,
          //             sortOrder: 0,
          //           },
          //         },
          //       ],
          //     },
          //   ],
          // };
          this.total = res.total;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 获取品牌列表
    categoryBrands(categoryId) {
      this.loading = true;
      apiGoods
        .categoryBrands(categoryId)
        .then((res) => {
          this.loading = false;
          this.brandList = res.data;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getParams(val) {
      // 筛选条件回显
      Object.assign(this.params, val);
      this.getGoodsList();
    },
  },
  created() {},
  mounted() {
    this.categoryId = this.$route.query.categoryId;
    this.level = this.$route.query.level;
    this.getGoodsList();
    this.getGategoryList({ categoryId: this.categoryId });
    this.categoryBrands({ categoryId: this.categoryId });
  },
  components: {
    GoodsClassNav,
    goodClassify,
  },
};
</script>

<style scoped lang="scss">
@import "../assets/styles/goodsList.scss";
.cate-nav {
  margin-top: 10px;
}
.goods-show-info > .goods-show-seller > .goods-show-buyer {
  width: 35px;
  height: 17px;
  white-space: nowrap;
  line-height: 17px;
  text-align: center;
  align-content: center;
  padding: 0 3px;
  background-color: #e23a3a;
}

.goods-show-tag {
  height: 18px;
  width: 32px;
  line-height: 14px;
  white-space: nowrap;
  text-align: center;
  align-items: center;
  padding: 0 3px;
}

.goods-show-seller {
  // padding:3px 0;
  vertical-align: middle;
}
.container {
  max-width: 1450px;
  margin: 10px auto 0;
  position: relative;
}
.price-sort:hover {
  color: #e23a3a;
}
.goods-box {
  display: flex;
}
/* ---------------侧边广告栏开始------------------- */

.goods-show-right {
  display: flex;
  flex-direction: row;
  margin-top: 5px;
}

/* ---------------商品栏开始------------------- */
.goods-list-box {
  position: relative;
  width: 100%;
  // margin-left: 15px;
  // width: calc(100% - 215px);
}
.goods-list-tool {
  width: 100%;
  height: 38px;
  border: 1px solid #ccc;
  background-color: #f1f1f1;
}
.goods-list-tool ul {
  padding-left: 15px;
  font-size: 12px;
  margin-top: 10px;
  &::after {
    content: "";
    display: block;
    clear: left;
  }

  .price-sort {
    span {
      display: inline-block;
      vertical-align: middle;
      width: 50px;
      height: 22px;
      position: relative;
      line-height: 15px;
      top: -2px;
      left: 0;
    }
    span > div {
      display: inline-block;
      .ivu-icon {
        font-size: 12px;
        position: absolute;
        &:nth-child(1) {
          top: 1px;
        }
        &:nth-child(2) {
          top: 7px;
        }
      }
      .price-color {
        color: #b3b3b3;
      }
    }
  }
}
.goods-list-tool li {
  cursor: pointer;
  float: left;
}
.goods-list-tool span {
  padding: 3px 5px;
  border: 1px solid #ccc;
  margin-left: -1px;
  background-color: #fff;
}
.goods-list-tool span:hover {
  border-color: $theme_color;
  position: relative;
  text-decoration: none;
  z-index: 1;
}
.goods-list-tool .ivu-icon {
  font-weight: bold;
  font-size: 16px;
}
.goods-list-tool-active {
  color: #fff;
  border-left: 1px solid #ccc;
  background-color: $theme_color !important;
}

/* ---------------商品栏结束------------------- */
// 面包屑
.breadcrumb {
  line-height: 50px;
  ::v-deep .ivu-breadcrumb {
    a {
      font-size: 14px;
      // color: #666;
      font-weight: 400;
    }
  }
}
.content {
  display: flex;
  max-width: 1450px;
  margin: 0 auto;
}
.left {
  width: calc(21% - 6px);
  min-height: 260px;
  padding-bottom: 50px;
  margin-top: 5px;
}
.right {
  flex: 1;
  margin: 5px 0 0 0;
}
.card-title {
  font-size: 15px;
  font-weight: 600;
}
.fs-14 {
  font-size: 14px;
}
.ml-5 {
  margin-left: 5px;
}
.gategory-item {
  font-size: 14px;
  display: inline-block;
  cursor: pointer;
  &:hover {
    color: red;
  }
}
.gategory-level-2 {
  padding-left: 10px;
}
.gategory-level-3 {
  padding-left: 20px;
}
.active {
  color: red;
}
</style>
