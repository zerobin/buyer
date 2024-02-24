<template>
  <div>
    <card _Title="My Address" _Src="/home/addAddress"></card>
    <div class="address-box" v-for="(item, index) in list" :key="index">
      <div class="address-header">
        <span>
          <Tag v-if="item.defaultFlag === 1" color="red">Default Address</Tag>
        </span>
        <div class="address-action">
          <span @click="edit(item.id)"
            ><Icon type="ios-create-outline" size="25"
          /></span>
          <span @click="del(item.id)"
            ><Icon type="ios-trash-outline" size="25"
          /></span>
        </div>
      </div>
      <div class="address-content">
        <p>
          <i class="iconfont icon-wode user-icon"></i
          >{{ item.firstName + " " + item.lastName }}
        </p>
        <p v-if="item.companyName">
          <i class="iconfont icon-address address-icon"></i
          >{{
            item.companyName +
            " " +
            item.address +
            " " +
            item.state +
            " " +
            item.country +
            " "
          }}
        </p>
        <p v-else>
          <i class="iconfont icon-address address-icon"></i
          >{{ item.address + " " + item.state + " " + item.country + " " }}
        </p>
        <p><i class="iconfont icon-iphone2 phone-icon"></i> {{ item.phone }}</p>
      </div>
    </div>
    <Button type="primary" @click="gotoAddress">Add Address</Button>
  </div>
</template>

<script>
import { apiAddressList, apiAddressDelete } from "@/api/address.js";
export default {
  name: "MyAddress",

  data() {
    return {
      list: [], // 地址列表
    };
  },
  methods: {
    gotoAddress() {
      this.$router.push("/home/addAddress");
    },
    edit(id) {
      // 编辑地址
      this.$router.push({ path: "/home/addAddress", query: { id: id } });
    },
    del(id) {
      // 删除地址
      this.$Modal.confirm({
        title: "warning",
        content: "Are you sure you want to delete this shipping address?",
        okText: "ok",
        cancelText: "cancel",
        onOk: () => {
          apiAddressDelete({ id }).then((res) => {
            if (res.code === 200) {
              this.$Message.success("sucess");
              this.getAddrList();
            }
          });
        },
        onCancel: () => {
          this.$Message.info("Cancel");
        },
      });
    },
    getAddrList() {
      // 获取地址列表
      apiAddressList()
        .then((res) => {
          this.list = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  mounted() {
    this.getAddrList();
  },
};
</script>

<style scoped lang="scss">
.address-box {
  padding: 15px;
  margin: 15px;

  border-bottom: 1px solid $border_color;
}

.address-header {
  cursor: pointer;
  height: 35px;
  display: flex;
  justify-content: space-between;
  @include title_color($light_title_color);
  font-size: 18px;
}

.address-content {
  cursor: pointer;
  font-size: 14px;

  > p {
    padding: 12px 0;
  }
}

.address-content-title {
}

.address-action span {
  margin-left: 5px;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    color: $theme_color;
  }
}

#map-container {
  width: 500px;
  height: 300px;
}
::v-deep .ivu-card-head {
  font-weight: 700;
  &::before {
    background: #fff;
  }
}
.user-icon,
.address-icon,
.phone-icon {
  font-size: 16px;
  color: #bbb;
  display: inline-block;
  width: 30px;
}
.address-icon {
  font-size: 22px;
  margin-left: -4px;
}
</style>
