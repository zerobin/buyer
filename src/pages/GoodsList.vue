<!--
 * @Date: 2023-11-19 13:06:03
 * @LastEditors: 庄鸿斌
 * @LastEditTime: 2024-02-24 10:44:04
-->
<template>
  <div class="wrapper">
    <!-- <BaseHeader></BaseHeader> -->
    <Search @search="handleSearch"></Search>
    <!-- 商品分类 -->
    <cateNav :showAlways="false"></cateNav>

    <div class="container">
      <div class="content">
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
export default {
  name: "GoodsList",

  beforeRouteEnter(to, from, next) {
    window.scrollTo(0, 0);
    next();
  },
  data() {
    return {
      custType: null,
      brand: [],
      categoryBar: [], // 分类
      goodsList: [], // 商品列表
      loading: false, // 加载状态
      total: 0, // 列表总数
      params: {
        // 请求参数
        pageNumber: 0,
        pageSize: 20,
        categoryId: "",
        custType: 0,
      },
    };
  },
  watch: {
    $route() {
      const keyword = this.$route.query.keyword;
      if (keyword) {
        this.handleSearch(keyword);
      }
      this.custType = this.$route.query.custType;
      if (this.$route.query.categoryId) {
        Object.assign(this.params, this.$route.query);
      } else {
        Object.assign(this.params, this.$route.query);
      }
      this.getGoodsList();
    },
  },
  methods: {
    // 搜索
    handleSearch(key) {
      this.params.keyword = key;
      this.$route.query.keyword = key;
      this.params.pageNumber = 0;
      this.getGoodsList();
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
      apiGoods
        .getGoodsByCustType(this.params)
        .then((res) => {
          this.loading = false;
          this.goodsList = res.rows;
          this.total = res.total;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
  mounted() {
    this.custType = this.$route.query.custType;
    if (this.$route.query.categoryId) {
      Object.assign(this.params, this.$route.query);
    } else {
      Object.assign(this.params, this.$route.query);
    }
    this.getGoodsList();
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
</style>
