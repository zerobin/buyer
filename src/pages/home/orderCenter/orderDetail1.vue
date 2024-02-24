<!--
 * @Date: 2024-02-19 00:03:06
 * @LastEditors: 庄鸿斌
 * @LastEditTime: 2024-02-19 01:11:38
-->
<template>
  <div class="search">
    <Card style="height: 60px">
      <div>
        <Button @click="modifyPrice" type="primary" v-if="pageType === 'edit'"
          >修改订单</Button
        >
        <!-- <Button @click="editAddress" type="primary" v-if="pageType === 'edit'"
          >修改收货地址</Button
        >
        <Button @click="editRemark" type="primary" v-if="pageType === 'edit'"
          >修改备注</Button
        >
        <Button @click="editResponseStatus" type="primary" v-if="pageType === 'edit'"
          >修改responseStatus</Button
        > -->
        <!-- <Button v-if="allowOperation.take" @click="orderTake" type="primary"
          >订单核销</Button
        >
        <Button v-if="allowOperation.ship" @click="orderDeliver" type="primary"
          >发货</Button
        > -->
      </div>
    </Card>

    <Card class="mt_10">
      <Row>
        <Col span="12">
          <div class="div-item">
            <div class="div-item-left">订单号：</div>
            <div class="div-item-right">
              {{ orderDetail.orderInfo && orderDetail.orderInfo.id }}
            </div>
          </div>

          <div class="div-item">
            <div class="div-item-left">订单分配状态：</div>
            <div class="div-item-right">
              {{ handleAssignStatus(orderDetail.orderInfo.assignStatus) }}
            </div>
          </div>
          <div class="div-item">
            <div class="div-item-left">订单状态：</div>
            <div class="div-item-right">
              {{ handleOrderStatus(orderDetail.orderInfo.orderStatus) }}
            </div>
          </div>
          <div class="div-item">
            <div class="div-item-left">订单响应状态：</div>
            <div class="div-item-right">
              {{ handleResponseStatus(orderDetail.orderInfo.responseStatus) }}
            </div>
          </div>
          <div class="div-item">
            <div class="div-item-left">收货信息：</div>
            <div class="div-item-right">
              {{ orderDetail.orderInfo.address }}
            </div>
          </div>
          <div class="div-item">
            <div class="div-item-left">备注：</div>
            <div class="div-item-right">
              {{ orderDetail.orderInfo.remark }}
            </div>
          </div>
        </Col>
        <Col span="12">
          <div class="div-item">
            <div class="div-item-left">顾客姓名：</div>
            <div class="div-item-right">
              {{ orderDetail.orderInfo.customerName }}
            </div>
          </div>
          <div class="div-item">
            <div class="div-item-left">顾客id：</div>
            <div class="div-item-right">
              {{ orderDetail.orderInfo && orderDetail.orderInfo.customerId }}
            </div>
          </div>

          <div class="div-item">
            <div class="div-item-left">下单时间：</div>
            <div class="div-item-right">
              {{ filtersFormatDate(orderDetail.orderInfo.createTime) }}
            </div>
          </div>
          <div class="div-item">
            <div class="div-item-left">响应时间：</div>
            <div class="div-item-right">
              {{ filtersFormatDate(orderDetail.orderInfo.responseTime) }}
            </div>
          </div>
          <div class="div-item">
            <div class="div-item-left">订单响应者：</div>
            <div class="div-item-right">
              {{ orderDetail.responseUserName }}
            </div>
          </div>
          <div class="div-item">
            <div class="div-item-left">订单响应者id：</div>
            <div class="div-item-right">
              {{ orderDetail.orderInfo.responseUserId }}
            </div>
          </div>
          <div class="div-item">
            <div class="div-item-left">分享码：</div>
            <div class="div-item-right">
              {{ orderDetail.orderInfo.shareCode }}
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
              <!-- <span v-for="(item, key) in JSON.parse(row.specs)" :key="key">
                <span
                  v-show="key != 'images'"
                  style="font-size: 12px; color: #999999"
                >
                  {{ key }} : {{ item }}
                </span>
              </span> -->
              <!-- <Poptip
                trigger="hover"
                style="display: block"
                title="扫码在手机中查看"
                transfer
              >
                <div slot="content">
                  <vue-qr
                    :text="wapLinkTo(row.goodsId, row.skuId)"
                    :margin="0"
                    colorDark="#000"
                    colorLight="#fff"
                    :size="150"
                  ></vue-qr>
                </div>
                <img
                  src="../../../assets/qrcode.svg"
                  class="hover-pointer"
                  width="20"
                  height="20"
                  alt=""
                />
              </Poptip> -->
            </div>
          </div>
        </template>
      </Table>
      <div class="goods-total">
        <ul>
          <li>
            <span class="label">商品总额：</span>
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
    <Modal v-model="modal" width="530">
      <p slot="header">
        <span>修改订单</span>
      </p>
      <div>
        <Form
          ref="modifyForm"
          :model="modifyForm"
          label-position="left"
          :label-width="120"
          :rules="modifyValidate"
        >
          <FormItem label="订单总价" prop="totalAmount">
            <Input style="width: 100%" v-model="modifyForm.totalAmount">
            </Input>
          </FormItem>
          <FormItem label="商家备注" prop="remark">
            <Input
              v-model="modifyForm.remark"
              :rows="4"
              style="width: 100%"
              type="textarea"
            >
            </Input>
          </FormItem>
          <FormItem label="订单响应状态" prop="responseStatus">
            <Select
              v-model="modifyForm.responseStatus"
              style="width: 100%"
              placeholder="请选择订单响应状态"
            >
              <Option
                v-for="item in responseStatusList"
                :value="item.value"
                :key="item.key"
                >{{ item.key }}</Option
              >
            </Select>
          </FormItem>
        </Form>
      </div>
      <div slot="footer" style="text-align: right">
        <Button @click="modal = false">关闭</Button>
        <Button type="primary" @click="modifySubmit">调整</Button>
      </div>
    </Modal>
    <!--收件地址弹出框-->
    <Modal v-model="addressModal" width="530">
      <p slot="header">
        <Icon type="edit"></Icon>
        <span>修改收件信息</span>
      </p>
      <div>
        <Form
          ref="addressForm"
          :model="addressForm"
          label-position="left"
          :label-width="100"
          :rules="addressRule"
        >
          <FormItem label="收件人" prop="consigneeName">
            <Input
              v-model="addressForm.consigneeName"
              size="large"
              maxlength="20"
            ></Input>
          </FormItem>
          <FormItem label="联系方式" prop="consigneeMobile">
            <Input
              v-model="addressForm.consigneeMobile"
              size="large"
              maxlength="11"
            ></Input>
          </FormItem>
          <FormItem label="地址信息" prop="consigneeAddressPath">
            <Input
              v-model="addressForm.consigneeAddressPath"
              disabled
              style="width: 325px"
              v-if="showRegion == false"
            />
            <Button
              v-if="showRegion == false"
              size="small"
              @click="regionClick"
              :loading="submitLoading"
              type="primary"
              style="margin-left: 8px"
              >修改
            </Button>
            <region
              style="width: 400px"
              @selected="selectedRegion"
              v-if="showRegion == true"
            />
          </FormItem>
          <FormItem label="详细地址" prop="consigneeDetail">
            <Input
              v-model="addressForm.consigneeDetail"
              size="large"
              maxlength="11"
            ></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer" style="text-align: right">
        <Button @click="addressModal = false">关闭</Button>
        <Button type="primary" @click="editAddressSubmit">修改</Button>
      </div>
    </Modal>
    <!-- 订单核销 -->
    <Modal v-model="orderTakeModal" width="530">
      <p slot="header">
        <Icon type="edit"></Icon>
        <span>订单核销</span>
      </p>
      <div>
        <Form
          ref="orderTakeForm"
          :model="orderTakeForm"
          label-position="left"
          :label-width="100"
          :rules="orderTakeValidate"
        >
          <FormItem label="核销码" prop="qrCode">
            <Input
              v-model="orderTakeForm.qrCode"
              size="large"
              maxlength="10"
            ></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer" style="text-align: right">
        <Button @click="orderTakeModal = false">关闭</Button>
        <Button type="primary" @click="orderTakeSubmit">核销</Button>
      </div>
    </Modal>

    <!-- 查询物流 -->
    <Modal v-model="logisticsModal" width="40">
      <p slot="header">
        <span>查询物流</span>
      </p>
      <div class="layui-layer-wrap">
        <dl>
          <dt>订单号：</dt>
          <dd>
            <div class="text-box">{{ sn }}</div>
          </dd>
        </dl>
        <dl>
          <dt>物流公司：</dt>
          <dd>
            <div class="text-box">
              {{ logisticsInfo.shipper || orderDetail.orderInfo.logisticsName }}
            </div>
          </dd>
        </dl>
        <dl>
          <dt>快递单号：</dt>
          <dd>
            <div nctype="ordersSn" class="text-box">
              {{
                logisticsInfo.logisticCode || orderDetail.orderInfo.logisticsNo
              }}
            </div>
          </dd>
        </dl>
        <div class="div-express-log">
          <ul class="express-log">
            <li v-for="(item, index) in logisticsInfo.traces" :key="index">
              <span class="time">{{ item.AcceptTime || item.acceptTime }}</span>
              <span class="detail">{{
                item.AcceptStation || item.remark
              }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div slot="footer" style="text-align: right">
        <Button @click="logisticsModal = false">取消</Button>
      </div>
    </Modal>
    <!-- 订单发货 -->
    <Modal v-model="orderDeliverModal" width="500px">
      <p slot="header">
        <span>订单发货</span>
      </p>
      <div>
        <Form
          :model="faceSheetForm"
          ref="faceSheetForm"
          v-if="facesheetFlag"
          :rules="faceSheetFormValidate"
        >
          <FormItem
            label="物流公司"
            prop="logisticsId"
            style="position: relative"
            :label-width="90"
          >
            <Select
              v-model="faceSheetForm.logisticsId"
              placeholder="请选择"
              style="width: 250px"
            >
              <Option
                v-for="(item, i) in checkedLogistics"
                :key="i"
                :value="item.logisticsId"
                >{{ item.name }}
              </Option>
            </Select>
          </FormItem>
        </Form>
        <Form
          v-else
          ref="orderDeliveryForm"
          :model="orderDeliveryForm"
          :label-width="90"
          :rules="orderDeliverFormValidate"
          style="position: relative"
        >
          <FormItem label="物流公司" prop="logisticsId">
            <Select
              v-model="orderDeliveryForm.logisticsId"
              placeholder="请选择"
              style="width: 250px"
            >
              <Option
                v-for="(item, i) in checkedLogistics"
                :key="i"
                :value="item.logisticsId"
                >{{ item.name }}
              </Option>
            </Select>
          </FormItem>
          <!-- v-if="showOrder" -->
          <FormItem label="物流单号" prop="logisticsNo">
            <Input
              v-model="orderDeliveryForm.logisticsNo"
              style="width: 250px"
            />
          </FormItem>
        </Form>
      </div>

      <div slot="footer" style="text-align: right">
        <Button @click="orderDeliverModal = false">关闭</Button>
        <Button type="primary" @click="orderDeliverySubmit">发货</Button>
      </div>
    </Modal>
    <!-- 打印发货单 -->
    <!-- <Modal v-model="printModal" width="530" @on-cancel="printCancel">
      <p slot="header" style="line-height: 26px; height: 26px">
        <span style="float: left">打印发货单</span>
        <Button
          size="small"
          style="margin-right: 35px; float: right; padding-bottom: 2px"
          @click="printHiddenInfo"
          ><template v-if="printHiddenFlag">显示</template
          ><template v-else>隐藏</template>敏感信息</Button
        >
      </p>
      <div style="max-height: 500px; overflow-y: auto; overflow-x: hidden">
        <div id="printInfo">
          <Row v-if="orderDetail.orderInfo.remark !== ''">
            <Col span="24">
              <p class="lineH30 f14">备注：{{ orderDetail.orderInfo.remark }}</p>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <p class="lineH30 f14">
                收件人：{{ orderDetail.orderInfo.consigneeName }}
              </p>
            </Col>
            <Col span="12" v-if="orderDetail.orderInfo.consigneeMobile">
              <p class="lineH30 f14" v-if="printHiddenFlag">
                手机号：{{
                  orderDetail.orderInfo.consigneeMobile.replace(
                    /^(.{3})(?:\d+)(.{4})$/,
                    "$1****$2"
                  )
                }}
              </p>
              <p class="lineH30 f14" v-else>
                手机号：{{ orderDetail.orderInfo.consigneeMobile }}
              </p>
            </Col>
          </Row>
          <Row>
            <Col span="24">
              <p class="lineH30 f14">
                收货地址：{{ orderDetail.orderInfo.consigneeAddressPath
                }}{{ orderDetail.orderInfo.consigneeDetail }}
              </p>
            </Col>
          </Row>
          <Row>
            <Col span="24">
              <p class="printgoodtitle">商品信息</p>
              <div class="printgoodinfo">
                <div
                  v-for="(item, index) in orderInfo.items"
                  :key="index"
                  class="printgooditem"
                >
                  <div class="printgoodname">
                    <p>{{ item.goodsName }}</p>
                    <div class="printgoodguid">
                      <span
                        v-for="(itemchild, keychild) in JSON.parse(item.specs)"
                        :key="keychild"
                      >
                        <span
                          class="printgoodguiditem"
                          v-if="keychild != 'images'"
                        >
                          {{ keychild }} : {{ itemchild }}
                        </span>
                      </span>
                    </div>
                  </div>
                  <span class="printgoodnumber">数量：{{ item.num }}</span>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      <div slot="footer" style="text-align: right">
        <Button @click="printModal = false">关闭</Button>
        <Button type="primary" v-print="printInfoObj">打印发货单</Button>
      </div>
    </Modal> -->
  </div>
</template>

<script>
// import * as API_Order from "@/api/order";
// import * as API_Logistics from "@/api/logistics";
// import liliMap from "@/views/my-components/map/index";
// import region from "@/views/lili-components/region";
import {
  aipOrderList,
  aipOrderDetail,
  aipOrderUpdate,
} from "@/api/order/goods-order";
import { formatDate } from "@/plugins/utils";

export default {
  name: "orderDetail",
  components: {
    // liliMap,
    // region,
  },
  data() {
    const numRule = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入总价格"));
      } else if (+value > 0) {
        callback(new Error("请输入大于0的金额"));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      orderDetail: {
        items: [],
        orderInfo: {},
      },
      typeList: [],
      showPrices: false,
      printHiddenFlag: false, //隐藏信息
      printInfoObj: {
        id: "printInfo", //要打印的id名 无#号
        popTitle: "&nbsp;", //页眉标题 默认浏览器标题 空字符串时显示undefined 使用html语言
        extraHead: "", //头部文字 默认空
      },
      submitLoading: false, // 添加或编辑提交状态
      region: [], //地区
      regionId: [], //地区id
      logisticsType: "KUAIDINIAO", //物流类型
      showRegion: false,
      someJSONdata: "",
      faceSheetForm: {
        logisticsId: "",
      },
      faceSheetFormValidate: {
        logisticsId: [{ required: true, message: "请选择物流公司" }],
      },
      facesheetFlag: false, //电子面单标识
      orderLogModal: false, //弹出调整价格框
      logisticsModal: false, //弹出查询物流框
      orderDeliverModal: false, //订单发货弹出框
      orderTakeModal: false, //订单核销弹出框
      checkedLogistics: [], //选中的物流公司集合
      allowOperation: {}, //订单可才做选项
      logisticsInfo: {
        shipper: "",
      }, //物流信息
      sn: "", //订单编号
      orderInfo: {
        // 订单信息
        order: {
          priceDetailDTO: {},
        },
      },
      modal: false, //弹出调整价格框
      printModal: false, //弹出打印发货单
      //调整价格表单
      modifyForm: {
        id: "",
        totalAmount: 0,
        responseStatus: 0,
        remark: "",
      },
      //订单核销表单
      orderTakeForm: {
        qrCode: "",
      },
      //验证要调整的订单金额
      orderTakeValidate: {
        qrCode: [
          { required: true, message: "订单核销码不能为空", trigger: "blur" },
        ],
      },
      //订单发货
      orderDeliveryForm: {
        logisticsNo: "", //发货单号
        logisticsId: "", //物流公司
      },
      //验证要调整的订单金额
      modifyValidate: {
        totalAmount: [
          {
            required: true,
            message: "请输入大于0合法金额",
            pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/,
            trigger: "blur",
          },
        ],
        responseStatus: [
          { required: true, message: "请选择订单响应状态", trigger: "change" },
        ],
      },
      addressModal: false, //弹出修改收件信息框
      //收件地址表单
      addressForm: {
        consigneeName: "",
        consigneeMobile: "",
        consigneeDetail: "",
        consigneeAddressPath: "",
        consigneeAddressIdPath: "",
      },
      orderDeliverFormValidate: {
        logisticsNo: [
          { required: true, message: "发货单号不能为空", trigger: "change" },
        ],
      },
      addressRule: {
        consigneeName: [
          { required: true, message: "收货人姓名不能为空", trigger: "blur" },
        ],
        consigneeMobile: [
          { required: true, message: "联系方式不能为空", trigger: "blur" },
          {
            pattern:
              /^0?(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])[0-9]{8}$/,
            trigger: "blur",
            message: "请输入正确的手机号",
          },
        ],
        consigneeDetail: [
          { required: true, message: "详细地址不能为空", trigger: "blur" },
        ],
      },

      columns: [
        {
          title: "商品",
          key: "goodsName",
          minWidth: 400,
          slot: "goodsSlot",
        },
        {
          title: "单价",
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
          title: "数量",
          key: "quantity",
          minWidth: 80,
        },
        {
          title: "梯度价格",
          key: "skus",
          minWidth: 80,
          render: (h, params) => {
            if (!params.row.skus.stepPrices) {
              return h("div", this.$options.filters.unitPrice(0, "$"));
            }
            return h(
              "div",
              this.$options.filters.unitPrice(
                params.row.skus.stepPrices[0].price,
                "$"
              )
            );
          },
        },
        {
          title: "小计",
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
      orderLogColumns: [
        // 表头
        {
          title: "时间",
          key: "createTime",
          minWidth: 120,
        },
        {
          title: "操作者",
          key: "operatorName",
          minWidth: 120,
        },
        {
          title: "操作类型",
          key: "operatorType",
          minWidth: 120,
        },
        {
          title: "日志",
          key: "message",
          minWidth: 200,
        },
      ],
      // 订单日志数据
      orderLogData: [],
      pageType: "edit", // 页面类型， 默认是edit， views表示只能查看
      responseStatusList: [
        {
          key: "未处理",
          value: "0",
        },
        {
          key: "处理中",
          value: "1",
        },
        {
          key: "已处理",
          value: "2",
        },
      ],
    };
  },
  methods: {
    filtersFormatDate(date) {
      return formatDate(date);
    },
    linkToPC(goodsId) {
      window.open(
        `${process.env.VUE_APP_PC_URL}/goodsDetail?goodsId=${goodsId}`,
        "_blank"
      );
    },
    handleResponseStatus(status) {
      const responseStatus = {
        0: "未处理",
        1: "处理中",
        2: "已处理",
      };
      return responseStatus[status];
    },
    handleOrderStatus(status) {
      const orderStatus = {
        0: "未处理",
        1: "处理中",
        2: "成功交易关闭",
        3: "未交易关闭",
        "-1": "用户取消",
        4: "运营人员取消",
      };
      return orderStatus[status];
    },
    handleAssignStatus(status) {
      const assignStatus = {
        0: "未分配",
        1: "手动分配",
        2: "自动分配",
      };
      return assignStatus[status];
    },
    //修改地址
    regionClick() {
      this.showRegion = true;
      this.regionId = "";
    },
    //弹出订单核销框
    orderTake() {
      this.orderTakeForm.qrCode = this.orderDetail.order.verificationCode;
      this.orderTakeModal = true;
    },
    //打印发货单
    printOrder() {
      this.printModal = true;
    },
    printHiddenInfo() {
      this.printHiddenFlag = !this.printHiddenFlag;
    },
    printCancel() {
      // this.printHiddenFlag = false;
    },
    //订单核销提交
    orderTakeSubmit() {
      this.$refs.orderTakeForm.validate((valid) => {
        if (valid) {
          API_Order.orderTake(this.sn, this.orderTakeForm.qrCode).then(
            (res) => {
              if (res.success) {
                this.$Message.success("订单核销成功");
                this.orderTakeModal = false;
                this.getDataDetail();
              }
            }
          );
        }
      });
    },
    getOrderPrice() {
      if (this.showPrices) {
        this.showPrices = false;
      } else if (!this.showPrices) {
        this.showPrices = true;
      }
    },
    getContentPrice() {
      for (let i = 0; i < this.typeList.length; i++) {
        for (let j = i + 1; j < this.typeList.length; j++) {
          if (this.typeList[i].promotionId === this.typeList[j].promotionId) {
            this.typeList[i].discountPrice =
              this.typeList[i].discountPrice + this.typeList[j].discountPrice;
            this.typeList.splice(j, 1);
          }
        }
      }

      if (this.typeList.length >= 3) {
        // this.getContentPrice();
      }
    },
    //获取订单详细信息
    getDataDetail() {
      this.loading = true;
      console.log(this.order, "=====");
      aipOrderDetail({ orderId: this.order }).then((res) => {
        this.loading = false;
        if (res.code === 200) {
          this.orderDetail = res.data;
          this.data = res.data.items;
          // this.typeList = JSON.parse(
          //   JSON.stringify(res.result.order.priceDetailDTO.discountPriceDetail)
          // );
          // this.getContentPrice();
          this.getOrderPrice();
        }
      });
    },
    Toprint() {
      this.facesheetFlag = true;
      API_Logistics.getCheckedOn().then((res) => {
        if (res.success) {
          this.checkedLogistics = res.result;
          this.orderDeliverModal = true;
        }
      });
    },
    // 修改订单金额
    modifyPrice() {
      //默认要修改的金额为订单总金额
      this.modifyForm = {
        id: this.order,
        totalAmount: this.orderDetail.orderInfo.totalAmount,
        responseStatus: this.orderDetail.orderInfo.responseStatus,
        remark: this.orderDetail.orderInfo.remark,
      };
      this.modal = true;
    },
    //修改订单金额提交
    modifySubmit() {
      this.$refs.modifyForm.validate((valid) => {
        if (valid) {
          this.modifyForm.totalAmount = +this.modifyForm.totalAmount;
          aipOrderUpdate(this.modifyForm)
            .then((res) => {
              if (res.code === 200) {
                this.$Message.success("修改订单成功");
                this.modal = false;
                this.getDataDetail();
              }
            })
            .catch((err) => {
              this.$Message.error(err.msg);
              this.modal = false;
            });
        }
      });
    },
    // 选中的地址
    selectedRegion(val) {
      this.region = val[1];
      this.regionId = val[0];
    },
    //查询物流
    logistics() {
      this.logisticsModal = true;
      API_Order.getTraces(this.sn).then((res) => {
        if (res.success && res.result != null) {
          this.logisticsInfo = res.result;
        }
      });
    },
    //订单发货
    orderDeliver() {
      this.facesheetFlag = false;
      if (this.logisticsType == "SHUNFENG") {
        this.$Modal.confirm({
          title: "确认发货",
          content: "您确认使用顺丰发货 " + this.sn + " 订单?",
          loading: true,
          onOk: () => {
            API_Order.orderShunFengDelivery(this.sn).then((res) => {
              if (res.success) {
                this.$Modal.remove();
                this.$Message.success("订单发货成功");
                this.getDataDetail();
              }
            });
          },
        });
      } else {
        API_Order.getLogisticsChecked().then((res) => {
          if (res.success) {
            this.checkedLogistics = res.result;
            this.orderDeliverModal = true;
          }
        });
      }
    },
    //顺丰打印面单
    sfPrint() {
      API_Order.getOrderFaceSheet(this.sn, this.faceSheetForm).then((res) => {
        if (res.success) {
          let headers = {
            "X-Auth-token": res.result.token,
          };
          API_Logistics.getShunFengFaceSheet(res.result.url, headers).then(
            (res) => {
              const blob = new Blob([res], {
                type: "application/pdf;charset=utf-8",
              });

              //对于<a>标签，只有 Firefox 和 Chrome（内核） 支持 download 属性
              //IE10以上支持blob但是依然不支持download
              if ("download" in document.createElement("a")) {
                //支持a标签download的浏览器
                const link = document.createElement("a"); //创建a标签
                link.download = this.orderDetail.order.sn + ".pdf"; //a标签添加属性
                link.style.display = "none";
                link.href = URL.createObjectURL(blob);
                document.body.appendChild(link);
                link.click(); //执行下载
                URL.revokeObjectURL(link.href); //释放url
                document.body.removeChild(link); //释放标签
              } else {
                navigator.msSaveBlob(blob, fileName);
              }
            }
          );
        }
      });
    },
    Toprints() {
      if (this.form.logisticsId != null && this.form.logisticsId != "") {
        this.orderDeliverModal = false;
      }
    },
    //订单发货提交
    orderDeliverySubmit() {
      if (this.facesheetFlag) {
        this.$refs["faceSheetForm"].validate((valid) => {
          if (valid) {
            API_Order.getOrderFaceSheet(this.sn, this.faceSheetForm).then(
              (res) => {
                if (res.success) {
                  this.someJSONdata = res.result.printTemplate;
                  this.Toprints();
                }
              }
            );
          }
        });
      } else {
        this.$refs["orderDeliveryForm"].validate((valid) => {
          if (valid) {
            API_Order.orderDelivery(this.sn, this.orderDeliveryForm).then(
              (res) => {
                if (res.success) {
                  this.$Message.success("订单发货成功");
                  this.orderDeliverModal = false;
                  this.getDataDetail();
                }
              }
            );
          }
        });
      }
    },
    //弹出修改收货地址框
    editAddress() {
      this.addressModal = true;
      this.showRegion = false;
      this.regionId = this.orderDetail.order.consigneeAddressIdPath;
      this.region = this.orderDetail.order.consigneeAddressPath;
      this.addressForm.consigneeName = this.orderDetail.order.consigneeName;
      this.addressForm.consigneeMobile = this.orderDetail.order.consigneeMobile;
      this.addressForm.consigneeDetail = this.orderDetail.order.consigneeDetail;
      this.addressForm.consigneeAddressPath =
        this.orderDetail.order.consigneeAddressPath;
      this.addressForm.consigneeAddressIdPath =
        this.orderDetail.order.consigneeAddressIdPath;
    },
    //修改收货地址
    editAddressSubmit() {
      if (this.regionId == "") {
        this.$Message.error("请选择地址");
        return;
      }
      this.addressForm.consigneeAddressPath = this.region;
      this.addressForm.consigneeAddressIdPath = this.regionId;
      this.$refs.addressForm.validate((valid) => {
        if (valid) {
          API_Order.editOrderConsignee(this.sn, this.addressForm).then(
            (res) => {
              if (res.success) {
                this.$Message.success("收货地址修改成功");
                this.addressModal = false;
                this.getDataDetail();
              }
            }
          );
        }
      });
    },

    getLogisticsSetting() {
      API_Logistics.getLogisticsSetting().then((res) => {
        if (res.success) {
          this.logisticsType = res.result;
        }
      });
    },
  },
  mounted() {
    this.order = this.$route.query.id;
    this.pageType = this.$route.query.pageType || "edit";
    this.getDataDetail();
    // this.getLogisticsSetting();
  },
  // 如果是从详情页返回列表页，修改列表页keepAlive为true，确保不刷新页面
  beforeRouteLeave(to, from, next) {
    if (to.name === "orderList" || to.name === "virtualOrderList") {
      to.meta.keepAlive = true;
    }
    next();
  },
};
</script>
<style lang="scss" scoped>
// 建议引入通用样式 可删除下面样式代码
// @import "@/styles/table-common.scss";
.lineH30 {
  line-height: 30px;
}

.order-log-div {
  line-height: 30px;
  height: 500px;
  overflow-y: scroll;
}

dl dt {
  width: 100px;
  text-align: right;
}

.div-express-log {
  max-height: 300px;
  border: solid 1px #e7e7e7;
  background: #fafafa;
  overflow-y: auto;
  overflow-x: auto;
}

.express-log {
  margin-right: -10px;
  margin: 5px;
  padding: 10px;
  list-style-type: none;

  .time {
    width: 30%;
    display: inline-block;
    float: left;
  }

  .detail {
    width: 60%;
    margin-left: 30px;
    display: inline-block;
  }

  li {
    line-height: 30px;
  }
}

.layui-layer-wrap {
  dl {
    border-top: solid 1px #f5f5f5;
    margin-top: -1px;
    overflow: hidden;

    dt {
      font-size: 14px;
      line-height: 28px;
      display: inline-block;
      padding: 8px 1% 8px 0;
      color: #999;
    }

    dd {
      font-size: 14px;
      line-height: 28px;
      display: inline-block;
      padding: 8px 0 8px 8px;
      border-left: solid 1px #f5f5f5;

      .text-box {
        line-height: 40px;
        color: #333;
        word-break: break-all;
      }
    }
  }
}

.search {
  .div-item {
    line-height: 35px;
    display: flex;

    > .div-item-left {
      width: 150px;
    }

    > .div-item-right {
      flex: 1;
      word-break: break-all;
    }
  }

  button {
    margin-left: 5px;
  }

  .goods-total {
    padding: 20px;
    height: 220px;
    width: 100%;

    ul {
      margin-right: 10px;
      display: block;
      float: right;
      list-style-type: none;
      line-height: 25px;
    }

    .label {
      float: left;
      width: 500px;
      font-size: 14px;
      text-align: right;
    }

    .txt {
      float: left;
      width: 130px;
      font-size: 14px;
      text-align: right;
      font-family: verdana;
    }

    .flowPrice {
      font-size: 22px;
      color: red;
    }
  }
}

.theme_color {
}

.f14 {
  font-size: 14px;
  color: #333;
}

.printgoodtitle {
  font-size: 14px;
  line-height: 1.5;
  margin-top: 15px;
  color: #333;
}

.printgoodinfo {
  // font-size: 14px;
  // background: #f2f2f2;
  // border-bottom:2px solid #333 ;
  padding: 10px;
  overflow: hidden;
  color: #333;

  .printgooditem {
    border-bottom: 1px solid #e8eaec;
    display: flex;
    align-items: flex-start;
    overflow: hidden;
    line-height: 30px;
    margin-bottom: 10px;
    padding-bottom: 10px;

    .printgoodname {
      flex: 1;
      overflow: hidden;

      .printgoodguid {
        font-size: 12px;
        color: #999999;
        line-height: 1.5;

        .printgoodguiditem {
          margin-right: 10px;
        }
      }
    }

    .printgoodprice {
      width: 135px;
      margin-left: 15px;
    }

    .printgoodnumber {
      width: 85px;
      margin-left: 15px;
    }
  }
}

@media print {
  @page {
    size: auto;
    margin: 3mm;
  }

  html,
  body {
    height: inherit;
  }
}
</style>
