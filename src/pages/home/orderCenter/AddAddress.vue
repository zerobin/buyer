<template>
  <div>
    <card :_Title="isEdit ? 'Edit Address' : 'Add Address'" />
    <div class="add-box">
      <Form
        :model="formData"
        ref="form"
        label-position="left"
        :label-width="100"
        :rules="ruleInline"
      >
        <FormItem label="First Name" prop="firstName">
          <i-input
            v-model="formData.firstName"
            placeholder="firstName"
            style="width: 600px"
          ></i-input>
        </FormItem>
        <FormItem label="Last Name" prop="lastName">
          <i-input
            v-model="formData.lastName"
            placeholder="lastName"
            style="width: 600px"
          ></i-input>
        </FormItem>
        <FormItem label="Company Name" prop="companyName">
          <i-input
            v-model="formData.companyName"
            placeholder="Company Name"
            style="width: 600px"
          ></i-input>
        </FormItem>
        <FormItem label="Mobile Phone" prop="phone">
          <i-input
            v-model="formData.phone"
            placeholder="请输入收件人手机号"
            style="width: 600px"
          ></i-input>
        </FormItem>

        <FormItem label="Country" prop="country">
          <Select
            v-model="formData.country"
            filterable
            size="large"
            placeholder="Country Name"
            style="width: 600px"
          >
            <Option
              v-for="item in cityList"
              :value="item.countryNameEn"
              :key="item.id"
              >{{ item.countryNameEn }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="City" prop="city">
          <i-input
            v-model="formData.city"
            placeholder="City"
            style="width: 600px"
          ></i-input>
        </FormItem>
        <FormItem label="Province" prop="state">
          <i-input
            v-model="formData.state"
            placeholder="Province"
            style="width: 600px"
          ></i-input>
        </FormItem>
        <FormItem label="Address" prop="address">
          <i-input
            v-model="formData.address"
            placeholder="Address"
            style="width: 600px"
          ></i-input>
        </FormItem>
        <FormItem label="Zip Code" prop="zipCode">
          <i-input
            v-model="formData.zipCode"
            placeholder="zipCode"
            style="width: 600px"
          ></i-input>
        </FormItem>

        <FormItem label="default address">
          <i-switch
            v-model="formData.defaultFlag"
            :true-value="1"
            :false-value="0"
          />
        </FormItem>
      </Form>
    </div>
    <div class="mt_20">
      <Button type="primary" class="mr_10" :loading="loading" @click="save"
        >Save</Button
      >
      <Button @click="$router.back()">Back</Button>
    </div>
  </div>
</template>

<script>
import card from "@/components/card";
import { city } from "@/assets/data/city";
import storage from "@/plugins/storage.js";

import {
  apiAddressSave,
  apiAddressUpdate,
  apiAddressList,
} from "@/api/address";
export default {
  name: "AddAddress",
  data() {
    return {
      isEdit: false,
      cityList: city,
      formData: {
        // 添加地址表单
        defaultFlag: 0,
      },
      ruleInline: {
        // 验证规则
        firstName: [{ required: true, message: "firstName", trigger: "blur" }],
        lastName: [{ required: true, message: "LasttName", trigger: "blur" }],
        country: [
          {
            required: true,
            message: "Please select country",
            trigger: "change",
          },
        ],
        state: [{ required: true, message: "Province", trigger: "blur" }],
        city: [{ required: true, message: "City", trigger: "blur" }],
        address: [{ required: true, message: "Address", trigger: "blur" }],
        phone: [
          { required: true, message: "Mobile Phone" },
          // {
          //   pattern: RegExp.phone,
          //   trigger: "blur",
          //   message: "请输入正确的手机号",
          // },
        ],
        zipCode: [{ required: true, message: "zipCode" }],
      },
      loading: false, // 加载状态
    };
  },
  methods: {
    save() {
      // 保存地址
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.isEdit) {
            apiAddressUpdate(this.formData)
              .then((res) => {
                if (res.code === 200) {
                  this.loading = false;
                  this.$router.push("/home/MyAddress");
                }
              })
              .catch(() => {
                this.loading = false;
              });
          } else {
            let userInfo = JSON.parse(storage.getItem("userInfo")) || {};
            this.formData.userId = userInfo.userId;
            apiAddressSave(this.formData)
              .then((res) => {
                if (res.code === 200) {
                  this.loading = false;
                  this.$router.push("/home/MyAddress");
                }
              })
              .catch(() => {
                this.loading = false;
              });
          }
        }
      });
    },
    getAddrById(id) {
      // 获取地址详情
      apiAddressList({ id }).then((res) => {
        if (res.code === 200) {
          console.log(res);
          const data = res.data[0];
          this.formData = data;
        }
      });
    },
    getAddress(item) {
      // 获取地图选择信息
      console.log(item);
      this.$set(this.formData, "address", item.addr);
      this.$set(this.formData, "consigneeAddressIdPath", item.addrId);
      this.$set(this.formData, "detail", item.detail);
    },
  },
  mounted() {
    const id = this.$route.query.id;

    if (id) {
      this.isEdit = true;
      this.getAddrById(id);
    } else {
      this.isEdit = false;
    }
  },
  components: {
    card,
  },
};
</script>

<style scoped lang="scss">
.add-box {
  margin: 40px 0;
}
::v-deep .ivu-card-head {
  font-weight: 700;
  &::before {
    background: #fff;
  }
}
</style>
