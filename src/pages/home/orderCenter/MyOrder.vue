<template>
  <div class="wrapper">
    <!-- 卡片组件 -->
    <card
      _Title=" "
      :_Size="16"
      :_Tabs="changeWay"
      @_Change="changeTab"
      v-if="!homePage"
    ></card>
    <card
      _Title=" "
      :_Size="16"
      :_Tabs="changeWay"
      @_Change="changeTab"
      _More="All Order"
      _Src="/home/MyOrder"
      v-else
    ></card>
    <!-- 搜索 筛选 -->
    <!-- <div class="mb_24 box" v-if="!homePage">
      <div class="global_float_right">
        <Input
          class="width_300"
          search
          enter-button
          v-model="params.keywords"
          @on-search="getList"
          placeholder="请输入订单号搜索"
        />
      </div>
    </div> -->
    <!-- 订单列表 -->
    <empty v-if="orderList && orderList.length === 0" />

    <Table :columns="orderColumns" :data="orderList" v-else>
      <template slot-scope="{ row }" slot="point">
        <div :style="{ color: row.pointType === 'INCREASE' ? 'green' : 'red' }">
          <span v-if="row.pointType === 'INCREASE'">+</span
          >{{ row.variablePoint }}
        </div>
      </template>
      <template slot-scope="{ row }" slot="totalAmount">
        {{ row.totalAmount }}
      </template>
      <template slot-scope="{ row }" slot="handler">
        <Button
          v-if="row.orderStatus == '0' || row.orderStatus == '2'"
          size="small"
          type="success"
          @click="handleEdit(row)"
          style="margin-right: 10px"
          >Edit</Button
        >
        <Button
          v-if="row.orderStatus == '0' || row.orderStatus == '2'"
          size="small"
          type="error"
          @click="handleDelete(row.id)"
          style="margin-right: 10px"
          >Cancel</Button
        >
        <Button size="small" type="info" @click="handleDetail(row)"
          >Detail</Button
        >
      </template>
    </Table>
    <!-- 分页 -->
    <div class="page-size" v-if="!homePage">
      <Page
        style="float: right; margin-top: 10px"
        :current="params.pageNumber"
        :total="total"
        :page-size="params.pageSize"
        @on-change="changePage"
        @on-page-size-change="changePageSize"
        :page-size-opts="[10, 20, 50]"
        size="small"
        show-total
        show-elevator
      ></Page>
    </div>
    <!-- 选择售后商品 -->
    <Modal
      v-model="remarkModal"
      title="customerRemark"
      @on-ok="ok"
      @on-cancel="cancel"
    >
      <Form
        :model="formData"
        ref="form"
        label-position="left"
        :label-width="120"
        :rules="ruleInline"
      >
        <FormItem label="customerRemark" prop="customerRemark">
          <Input
            type="textarea"
            maxlength="500"
            v-model="formData.customerRemark"
            show-word-limit
            placeholder="order customerRemark"
          />
        </FormItem>
      </Form>
    </Modal>

    <Modal
      v-model="orderDetailModal"
      title="order detail"
      @on-cancel="cancelOrderDetail = false"
      width="1000"
    >
      <Card class="mt_10">
        <Row>
          <Col span="12">
            <div class="div-item">
              <div class="div-item-left">orderId：</div>
              <div class="div-item-right">
                {{ orderDetail.orderInfo && orderDetail.orderInfo.id }}
              </div>
            </div>

            <div class="div-item">
              <div class="div-item-left">Order Status：</div>
              <div class="div-item-right">
                {{ handleOrderStatus(orderDetail.orderInfo.orderStatus) }}
              </div>
            </div>

            <div class="div-item">
              <div class="div-item-left">address：</div>
              <div class="div-item-right">
                {{ orderDetail.orderInfo.address }}
              </div>
            </div>
            <div class="div-item">
              <div class="div-item-left">remark：</div>
              <div class="div-item-right">
                {{ orderDetail.orderInfo.remark }}
              </div>
            </div>
          </Col>
          <Col span="12">
            <div class="div-item">
              <div class="div-item-left">Customer Name：</div>
              <div class="div-item-right">
                {{ orderDetail.orderInfo.customerName }}
              </div>
            </div>
            <div class="div-item">
              <div class="div-item-left">Customer Email</div>
              <div class="div-item-right">
                {{ orderDetail.customerEmail }}
              </div>
            </div>

            <div class="div-item">
              <div class="div-item-left">createTime：</div>
              <div class="div-item-right">
                {{ filtersFormatDate(orderDetail.orderInfo.createTime) }}
              </div>
            </div>
            <div class="div-item">
              <div class="div-item-left">responseTime：</div>
              <div class="div-item-right">
                {{ filtersFormatDate(orderDetail.orderInfo.responseTime) }}
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      <Card class="mt_10">
        <Table
          :loading="loading"
          border
          :columns="columns"
          :data="data"
          ref="table"
        >
          <!-- 商品栏目格式化 -->
          <template slot="goodsSlot" slot-scope="{ row }">
            <div style="margin-top: 5px; height: 80px; display: flex">
              <div style="">
                <img
                  :src="row.picUrl.split(',')[0]"
                  style="height: 60px; margin-top: 1px; width: 60px"
                />
              </div>

              <div style="margin-left: 13px">
                <div class="div-zoom">
                  <a @click="linkToPC(row.goodsId)">{{ row.goodsName }}</a>
                </div>
                <div>
                  <Tag color="info"
                    ><span style="color: #000">{{ row.skuDesc }}</span></Tag
                  >
                </div>
              </div>
            </div>
          </template>
        </Table>
        <div class="goods-total">
          <ul>
            <li>
              <span class="label">totalAmount：</span>
              <span class="txt flowPrice">{{
                orderDetail.orderInfo.totalAmount | unitPrice("$")
              }}</span>
            </li>

            <!--
          <li>
            <span class="label">应付金额：</span>
            <span class="txt flowPrice"
              >¥{{ orderDetail.orderInfo.flowPrice | unitPrice }}</span
            >
          </li> -->
          </ul>
        </div>
      </Card>

      <template #footer>
        <Button type="error" @click="close">close</Button>
      </template>
    </Modal>
  </div>
</template>

<script>
import {
  apiOrderMyOrders,
  apiOrderCancel,
  apiOrderUpdate,
  apiOrderDetail,
} from "@/api/order";
import { afterSaleReason } from "@/api/member";
import { orderStatusList, tagcoloroOderStatusList } from "../enumeration.js";
import { formatDate } from "@/plugins/utils";
export default {
  name: "MyOrder",
  props: {
    homePage: {
      // 判断是否个人中心首页展示内容
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: false,
      orderDetailModal: false,
      formData: {
        // 表单数据
        customerRemark: "",
        orderId: "",
      },
      ruleInline: {
        customerRemark: [
          { required: true, message: "Please fill in the customerRemark" },
        ],
      },
      orderColumns: [
        // table展示数据
        {
          title: "Order Id",
          key: "id",
          align: "center",
        },
        {
          title: "Order createTime ",
          key: "createTime",
          align: "center",
        },
        {
          title: "Remark",
          key: "customerRemark",
          align: "center",
        },
        {
          title: "Grand Total",
          key: "totalAmount",
          slot: "totalAmount",
          align: "center",
        },
        {
          title: "Action",
          slot: "handler",
          align: "center",
        },
      ],
      orderList: [], // 订单列表
      params: {
        // 请求参数
        pageNumber: 1,
        pageSize: 10,
        // orderStatus: 'ALL',
        keywords: "",
        orderStatus: 0,
      },
      cancelParams: {
        // 取消售后参数
        orderSn: "",
        reason: "",
      },
      // 状态数组
      orderStatusList,
      tagcoloroOderStatusList,
      changeWay: [
        "Submitted",
        "In progress",
        "Successful",
        "Failed Transaction",
        "Cancel",
      ], // 订单状态
      total: 0, // 数据总数
      spinShow: false, // 加载状态
      remarkModal: false, // 选择售后商品模态框
      afterSaleArr: [], // 售后商品列表
      cancelAvail: false, // 取消订单modal控制
      cancelReason: [], // 取消订单原因
      orderDetail: {
        items: [],
        orderInfo: {},
      },
      typeList: [],
      columns: [
        {
          title: "goodsName",
          key: "goodsName",
          minWidth: 400,
          slot: "goodsSlot",
        },
        {
          title: "unitPrice",
          key: "unitPrice",
          minWidth: 100,
          render: (h, params) => {
            if (!params.row.unitPrice) {
              return h("div", this.$options.filters.unitPrice(0, "$"));
            }
            return h(
              "div",
              this.$options.filters.unitPrice(params.row.unitPrice, "$")
            );
          },
        },

        {
          title: "quantity",
          key: "quantity",
          minWidth: 80,
        },
        // {
        //   title: "stepPrices",
        //   key: "skus",
        //   minWidth: 80,
        //   render: (h, params) => {
        //     if (!params.row.skus.stepPrices) {
        //       return h("div", this.$options.filters.unitPrice(0, "$"));
        //     }
        //     return h(
        //       "div",
        //       this.$options.filters.unitPrice(
        //         params.row.skus.stepPrices[0].price,
        //         "$"
        //       )
        //     );
        //   },
        // },
        {
          title: "subTotal",
          key: "subTotal",
          minWidth: 100,
          render: (h, params) => {
            if (!params.row.skus.stepPrices) {
              return h(
                "div",
                this.$options.filters.unitPrice(
                  params.row.quantity * params.row.unitPrice,
                  "$"
                )
              );
            }
            return h(
              "div",
              this.$options.filters.unitPrice(
                params.row.quantity * params.row.skus.stepPrices[0].price,
                "$"
              )
            );
          },
        },
      ],
      data: [], // 商品表单数据
    };
  },
  mounted() {
    if (this.homePage) this.params.pageSize = 5;
    this.getList();
  },
  methods: {
    close() {
      this.orderDetailModal = false;
    },
    filtersFormatDate(date) {
      return formatDate(date);
    },
    linkToPC(goodsId) {
      window.open(
        location.protocol +
          "//" +
          location.host +
          `/goodsDetail?goodsId=${goodsId}`,
        "_blank"
      );
    },
    handleResponseStatus(status) {
      const responseStatus = {
        0: "as yet unprocessed", // 未处理
        1: "in progress", // 处理中
        2: "processed", // 已处理
      };
      return responseStatus[status];
    },
    handleOrderStatus(status) {
      const orderStatus = {
        0: "as yet unprocessed", // 未处理
        1: "in progress", // 处理中
        2: "Successful transaction closure", //  成功交易关闭
        3: "Closure of non-transactions", // 未交易关闭
        "-1": "User cancellation", // 用户取消
        4: "Operational staff cancellation", // 运营人员取消
      };
      return orderStatus[status];
    },
    handleAssignStatus(status) {
      const assignStatus = {
        0: "unallocated", //未分配
        1: "manual distribution", // 手动分配
        2: "automatic distribution", // 自动分配
      };
      return assignStatus[status];
    },
    async ok() {
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          let res = await apiOrderUpdate(this.formData);
          if (res.code === 200) {
            this.$Message.success("Cancellation successful");
          }
        }
      });
    },
    cancel() {
      this.remarkModal = false;
    },
    handleEdit(row) {
      console.log(row, "----");
      this.formData = {
        orderId: row.id,
        customerRemark: row.customerRemark,
      };
      this.remarkModal = true;
    },
    handleDelete(orderId) {
      this.$Modal.confirm({
        title: "Delete",
        content: "<p>Confirmation of order cancellation?</p>",
        okText: "OK",
        cancelText: "Cancel",
        onOk: async () => {
          let res = await apiOrderCancel({ orderId });
          if (res.code === 200) {
            this.getList();
            this.$Message.success("Cancellation successful");
          }
        },
      });
    },
    async handleDetail(row) {
      try {
        console.log(row, "0000");
        let res = await apiOrderDetail({ orderId: row.id });
        if (res.code === 200) {
          this.orderDetailModal = true;
          this.orderDetail = res.data;
          this.data = res.data.items;
        }
      } catch (err) {
        console.log(err);
      }
    },
    changePage(val) {
      // 修改页码
      this.params.pageNumber = val;
      this.getList();
    },
    goodsDetail(skuId, goodsId) {
      // 跳转商品详情
      let routeUrl = this.$router.resolve({
        path: "/goodsDetail",
        query: { skuId, goodsId },
      });
      window.open(routeUrl.href, "_blank");
    },
    // 切换订单状态
    changeTab(index) {
      this.params.orderStatus = index;
      this.getList();
    },
    // 跳转店铺首页
    shopPage(id) {
      let routeUrl = this.$router.resolve({
        path: "/Merchant",
        query: { id: id },
      });
      window.open(routeUrl.href, "_blank");
    },

    getList() {
      // 获取订单列表
      this.spinShow = true;

      let params = JSON.parse(JSON.stringify(this.params));
      apiOrderMyOrders(params).then((res) => {
        this.spinShow = false;
        if (res.code === 200) {
          this.orderList = res.rows;
          this.total = res.total;
        }
      });
    },
    changePageNum(val) {
      // 修改页码
      this.params.pageNumber = val;
      this.getList();
    },
    changePageSize(val) {
      // 修改页数
      this.params.pageNumber = 1;
      this.params.pageSize = val;
      this.getList();
    },
    handleCancelOrder(sn) {
      // 取消订单
      this.cancelParams.orderSn = sn;
      afterSaleReason("CANCEL").then((res) => {
        if (res.success) {
          this.cancelReason = res.result;
          this.cancelAvail = true;
          this.cancelParams.reason = this.cancelReason[0].reason;
        }
      });
    },
    sureCancel() {
      // 确定取消
      apiOrderCancel(this.cancelParams).then((res) => {
        if (res.success) {
          this.$Message.success("取消订单成功");
          this.getList();
          this.cancelAvail = false;
        }
      });
    },
    filterOrderStatus(status) {
      // 获取订单状态中文
      const ob = this.orderStatusList.filter((e) => {
        return e.status === status;
      });
      return ob && ob[0] ? ob[0].name : status;
    },
    tagOrderStatus(status) {
      // 获取订单状态中文
      const ob = this.tagcoloroOderStatusList.filter((e) => {
        return e.status === status;
      });
      return ob && ob[0] ? ob[0].name : status;
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .ivu-card-head {
  &::before {
    background: #fff;
  }
}
.wrapper {
  margin-bottom: 40px;
}
.box {
  overflow: hidden;
}
.page-size {
  margin: 15px 0px;
  text-align: right;
}
/** 订单列表 */
.order-list {
  border: 1px solid #ddd;
  border-radius: 3px;
  margin-bottom: 10px;

  &:hover {
    .del-btn {
      visibility: visible;
    }
  }
  .del-btn {
    visibility: hidden;
  }

  .order-header {
    display: flex;
    align-items: center;
    padding: 10px;
    justify-content: space-between;
    border-bottom: 1px solid #ddd;
    > div:nth-child(1) > div:nth-child(2) {
      font-size: 12px;
      color: #999;
      margin-top: 3px;
    }
  }
  .order-body {
    display: flex;
    justify-content: space-between;
    color: #999;
    padding: 10px;

    .goods-list > div {
      width: 500px;
      display: flex;
      margin-bottom: 10px;
      img {
        width: 60px;
        height: 60px;
        margin-right: 10px;
      }
      > div {
        flex: 1;
      }
    }

    > div:nth-child(2) {
      width: 150px;
      text-align: center;
      span {
        color: #438cde;
        cursor: pointer;
        &:hover {
          color: $theme_color;
        }
      }
      .ivu-icon {
        color: #ff8f23;
        cursor: pointer;
        &:hover {
          color: $theme_color;
        }
      }
    }

    > div:nth-child(3) {
      width: 100px;
      .ivu-btn {
        margin-bottom: 10px;
      }
    }
  }
}
.div-item {
  display: flex;
  font-size: 14px;
  margin: 5px 0;
}
.div-item-left {
  width: 180px;
  font-weight: 700;
}
.div-item-right {
  font-size: 14px;
  flex: 1;
}
</style>
