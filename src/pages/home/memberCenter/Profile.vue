<template>
  <div class="wrapper">
    <card _Title=" " :_Size="16" :_Tabs="changeWay" @_Change="changeTab"></card>
    <div v-if="tabIndex === 0">
      <Form
        :model="formItem"
        :rules="rules"
        ref="form"
        label-position="left"
        :label-width="160"
      >
        <FormItem label="Profile">
          <Avatar v-if="formItem.avatar" :src="formItem.avatar" size="50" />
          <Avatar v-else icon="ios-person" size="50" />
          <Upload
            :show-upload-list="false"
            :on-success="handleSuccess"
            :format="['jpg', 'jpeg', 'png']"
            :action="action"
            :headers="accessToken"
          >
            <!-- <Button class="mt_10">上传头像</Button> -->
            <div class="edit-profile">
              <i class="iconfont icon-edit"></i>
              <span>Edit Profile</span>
            </div>
          </Upload>
        </FormItem>
        <FormItem label="Email Address" prop="email">
          <span class="email">{{ formItem.email }}</span>
        </FormItem>
        <FormItem label="Name" prop="nickName">
          <Input
            size="large"
            class="wrapper-user-name"
            v-model="formItem.nickName"
            placeholder="Name"
            style="width: 400px"
          />
        </FormItem>
        <FormItem label="Gender">
          <RadioGroup v-model="formItem.sex" size="large">
            <Radio label="1">Male</Radio>
            <Radio label="0">Female</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="Country / Region" prop="country">
          <Select
            v-model="formItem.country"
            filterable
            size="large"
            placeholder="Country Name"
            style="width: 400px"
          >
            <Option
              v-for="item in cityList"
              :value="item.countryNameEn"
              :key="item.id"
              >{{ item.countryNameEn }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="Address" prop="address">
          <Input
            size="large"
            class="wrapper-user-name"
            v-model="formItem.address"
            placeholder="Address"
            style="width: 400px"
          />
        </FormItem>
        <FormItem label="Phone" prop="phonenumber">
          <Input
            size="large"
            class="wrapper-user-name"
            v-model="formItem.phonenumber"
            placeholder="Phone"
            style="width: 400px"
          >
            <!-- <template #prepend>
            <span style="width: 40px; text-align: center; display: inline-block"
              >+86</span
            >
          </template> -->
          </Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="save">Save</Button>
        </FormItem>
      </Form>
    </div>
    <div v-else>
      <Form
        ref="formRegister"
        :model="formRegister"
        :rules="ruleInline"
        label-position="left"
        :label-width="160"
      >
        <FormItem label="Current Password" prop="oldPwd">
          <Input
            type="password"
            v-model="formRegister.oldPwd"
            clearable
            size="large"
            placeholder="Current Password"
            style="width: 400px"
            maxlength="12"
          />
        </FormItem>
        <FormItem label="New Password" prop="newPwd">
          <Input
            type="password"
            v-model="formRegister.newPwd"
            clearable
            size="large"
            placeholder="New Password"
            style="width: 400px"
            maxlength="12"
          >
          </Input>
        </FormItem>
        <FormItem label="Confirm Password" prop="againPassword">
          <Input
            type="password"
            v-model="formRegister.againPassword"
            clearable
            size="large"
            placeholder="Confirm Password"
            style="width: 400px"
            maxlength="12"
          >
          </Input>
        </FormItem>
      </Form>
      <div slot="footer" style="width: 50%; text-align: center">
        <Button
          type="primary"
          class="ml_10"
          style="width: 130px"
          @click="handlePassword"
          >save</Button
        >
      </div>
    </div>
  </div>
</template>

<script>
import storage from "@/plugins/storage.js";
import {
  apiUpdatePersonInfo,
  apiGetPersonInfo,
  updatePwd,
} from "@/api/account.js";
import { commonUrl } from "@/plugins/request.js";
import { city } from "@/assets/data/city";
export default {
  name: "Profile",
  data() {
    return {
      tabIndex: 0,
      rules: {
        // 验证规则
        nickName: [{ required: true, message: "Please enter your name" }],
        country: [
          {
            required: true,
            message: "Please select country",
            trigger: "change",
          },
        ],
        phonenumber: [
          {
            required: true,
            message: "Please enter phonenumber",
            trigger: "blur",
          },
        ],
        address: [
          { required: true, message: "Please enter address", trigger: "blur" },
        ],
      },
      cityList: city,
      formItem: {}, // 表单数据
      action: commonUrl + "/c/auth/upload", // 上传接口
      accessToken: {}, // 验证token
      changeWay: ["My Info", "Change Password"],
      formRegister: {
        // 第三步 新密码表单
        oldPwd: "",
        againPassword: "",
        newPwd: "",
      },
      ruleInline: {
        // 验证规则
        oldPwd: [{ required: true, message: "old password", trigger: "blur" }],
        newPwd: [
          { required: true, message: "new password", trigger: "blur" },
          {
            type: "string",
            min: 6,
            message: "Password cannot be less than 6 digits",
          },
        ],
        againPassword: [
          {
            required: true,
            message: "Please confirm the new password",
            trigger: "blur",
          },
          {
            type: "string",
            min: 6,
            message: "Password cannot be less than 6 digits",
          },
        ],
      },
    };
  },
  mounted() {
    // this.formItem = JSON.parse(storage.getItem("userInfo"));
    this.accessToken.Authorization = storage.getItem("accessToken");
    this.getPersonInfo();
  },
  methods: {
    changeTab(index) {
      this.tabIndex = index;
    },
    async getPersonInfo() {
      try {
        const res = await apiGetPersonInfo();
        if (res.code === 200) {
          this.formItem = res.data;
        }
      } catch (err) {
        console.log(err);
      }
    },
    save() {
      // 保存
      this.$refs.form.validate((valid) => {
        if (valid) {
          apiUpdatePersonInfo(this.formItem)
            .then((res) => {
              if (res.code === 200) {
                this.$Message.success(
                  "Personal information successfully updated"
                );
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    },
    handleSuccess(res, file) {
      // 上传成功
      this.$set(this.formItem, "avatar", res.msg);
    },
    // 修改
    handlePassword() {
      this.$refs["formRegister"].validate((valid) => {
        if (valid) {
          const { newPwd, againPassword, oldPwd } = this.formRegister;
          if (newPwd !== againPassword) {
            this.$Message.error({
              content: "Inconsistency between old and new passwords",
            });
            return;
          }
          const params = { newPwd, oldPwd };
          // params.newPwd = md5(newPwd);
          // params.oldPwd = md5(oldPwd);
          updatePwd(params)
            .then((res) => {
              if (res.code === 200) {
                this.$Message.success("Password update successful.");
                this.$router.push("/home/Profile");
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .ivu-upload {
  display: inline-block;
  margin-left: 5px;
}
::v-deep .ivu-form-item-label {
  font-size: 14px;
  color: #999;
}
.edit-profile {
  color: #999;
  cursor: pointer;
  font-size: 14px;
}
.username {
  text-align: center;
  padding: 15px 0px;
  width: 80%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0 auto;
  font-size: 14px;
}
.email {
  font-size: 14px;
  color: #999;
}
::v-deep .ivu-card-head {
  &::before {
    background: #fff;
  }
}
</style>
