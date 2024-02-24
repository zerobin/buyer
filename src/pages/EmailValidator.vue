<template>
  <div class="login" @keyup.enter="handleSubmit('formInline')">
    <!-- 顶部logo -->
    <div class="top-content" @click="$refs.verify.show = false">
      <a class="logo" href=""
        ><img :src="$store.state.logoImg" @click="$router.push('/')"
      /></a>

      <div class="stepBox">
        <div class="stepBoxItemBox actionClass">
          <div class="stepBoxItem">01</div>
        </div>
        <div class="stepBoxItemBox actionClass">
          <div class="stepBoxItem">02</div>
        </div>
      </div>
    </div>
    <!-- 登录主体 包含轮播图 登录模块 -->
    <div class="container">
      <!-- 登录模块 -->
      <div class="inner_wrap">
        <div class="main_img">
          <div
            class="common-img"
            style="width: 585px; height: 434px; display: inline-block"
            data-v-23d7a78b=""
          >
            <div class="el-image img-wrap">
              <img
                src="@/assets/images/bg_reg.png"
                ondragstart="return false;"
                class="el-image__inner"
                style="object-fit: cover"
              />
            </div>
          </div>
        </div>
        <div class="boder-box register">
          <!-- 忘记密码 -->
          <div class="RegFirst" v-if="type === 1">
            <div class="contain bg-white boder-box">
              <div class="title size32 bold">Reset Your Password</div>
              <p class="size18 margin-t20">
                Please enter the verification code below to reset your password
              </p>
              <p class="size18 color-f8 margin-b20">{{ registInfo.email }}</p>
              <div>
                <Form
                  ref="formRePassword"
                  :model="formRegist"
                  :rules="ruleInline"
                  style="text-algin: center"
                >
                  <FormItem prop="one" class="email-validator-formitem">
                    <i-input type="text" v-model="formRegist.one" maxlength="1">
                    </i-input>
                  </FormItem>
                  <FormItem prop="two" class="email-validator-formitem">
                    <i-input type="text" v-model="formRegist.two" maxlength="1">
                    </i-input>
                  </FormItem>
                  <FormItem prop="three" class="email-validator-formitem">
                    <i-input
                      type="text"
                      v-model="formRegist.three"
                      maxlength="1"
                    >
                    </i-input>
                  </FormItem>
                  <FormItem prop="four" class="email-validator-formitem">
                    <i-input
                      type="text"
                      v-model="formRegist.four"
                      maxlength="1"
                    >
                    </i-input>
                  </FormItem>

                  <FormItem prop="password">
                    <i-input
                      type="password"
                      password
                      v-model="formRegist.password"
                      placeholder="New password"
                    >
                    </i-input>
                  </FormItem>
                  <FormItem>
                    <p
                      class="el-button text_btn el-button--text"
                      :class="[
                        reSendEmailStatus ? '' : 'is-disabled disabled-color',
                      ]"
                      @click="reSendEmail"
                    >
                      {{ timeMsg }} Send Code
                    </p>
                  </FormItem>

                  <FormItem>
                    <Button
                      style="
                        font-size: 16px;
                        height: 46px;
                        font-weight: 700;
                        width: 100%;
                      "
                      long
                      :class="[canSubmit ? '' : 'is-disabled']"
                      type="info"
                      @click="handleRepassword"
                      >Next</Button
                    >
                  </FormItem>
                </Form>
              </div>
            </div>
          </div>
          <!-- 注册 -->
          <div class="RegFirst" v-else>
            <div class="contain bg-white boder-box">
              <div class="title size32 bold">Verify your email</div>
              <p class="size18 margin-t20">Please enter the 4-digit code</p>
              <p class="size18 color-f8 margin-b20">{{ registInfo.email }}</p>
              <p
                class="el-button text_btn el-button--text"
                style="text-align: left; cursor: pointer"
                @click="modifyEmail()"
              >
                Modify email address
              </p>
              <div>
                <Form
                  ref="formRegist"
                  :model="formRegist"
                  :rules="ruleInline"
                  style="text-algin: center"
                >
                  <FormItem prop="one" class="email-validator-formitem">
                    <i-input type="text" v-model="formRegist.one" maxlength="1">
                    </i-input>
                  </FormItem>
                  <FormItem prop="two" class="email-validator-formitem">
                    <i-input type="text" v-model="formRegist.two" maxlength="1">
                    </i-input>
                  </FormItem>
                  <FormItem prop="three" class="email-validator-formitem">
                    <i-input
                      type="text"
                      v-model="formRegist.three"
                      maxlength="1"
                    >
                    </i-input>
                  </FormItem>
                  <FormItem prop="four" class="email-validator-formitem">
                    <i-input
                      type="text"
                      v-model="formRegist.four"
                      maxlength="1"
                    >
                    </i-input>
                  </FormItem>
                  <FormItem>
                    <p
                      class="el-button text_btn el-button--text"
                      :class="[
                        reSendEmailStatus ? '' : 'is-disabled disabled-color',
                      ]"
                      @click="reSendEmail"
                    >
                      {{ timeMsg }} Send Code
                    </p>
                  </FormItem>
                  <FormItem>
                    <p
                      style="
                        font-size: 13px;
                        color: rgb(153, 153, 153);
                        text-align: center;
                        line-height: 18px;
                      "
                    >
                      Make sure to also check your
                      <span style="font-weight: bold; color: rgb(34, 34, 34)"
                        >spam folder</span
                      >
                      if you haven't received the verification code yet.
                    </p>
                  </FormItem>
                  <FormItem>
                    <Button
                      style="
                        font-size: 16px;
                        height: 46px;
                        font-weight: 700;
                        width: 100%;
                      "
                      long
                      :class="[canSubmit ? '' : 'is-disabled']"
                      type="info"
                      @click="handleRegist"
                      >Create My Account</Button
                    >
                  </FormItem>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="foot">
      Copyright © {{ year }} ELEK Technology Co., Ltd. All Rights Reserved.
    </div>
  </div>
</template>

<script>
import * as RegExp from "@/plugins/RegExp.js";
import { md5 } from "@/plugins/md5.js";
import * as apiLogin from "@/api/login.js";
export default {
  name: "SignUp",
  data() {
    return {
      registInfo: null,
      config: require("@/config"),
      year: new Date().getFullYear(),
      canSubmit: false,
      type: 0, // 0表示注册， 1表示忘记密码
      formRegist: {
        // 注册表单
        one: "",
        two: "",
        three: "",
        four: "",
        password: "",
      },
      ruleInline: {
        // 验证规则
        one: [{ required: true, message: " " }],
        two: [{ required: true, message: " " }],
        three: [{ required: true, message: " " }],
        four: [{ required: true, message: " " }],
        password: [{ required: true, message: "Please enter your password" }],
      },
      reSendEmailStatus: false, // 是否验证通过
      verifyType: "REGISTER", // 验证状态
      timeMsg: 120, // 倒计时
      interval: "", // 定时器
      time: 120, // 倒计时
    };
  },
  created() {
    // 路由中带有type === resetEmail 表示是重置密码
    if (this.$route.query.type === "resetEmail") {
      this.type = 1;
      this.registInfo = {
        email: decodeURIComponent(this.$route.query.email),
      };
    } else {
      this.type = 0;
      this.registInfo = JSON.parse(localStorage.getItem("REGIST_INFO")) || {};
    }
    this.resetTime();
  },
  watch: {
    formRegist: {
      handler() {
        if (!this.type) {
          if (
            this.formRegist.one &&
            this.formRegist.two &&
            this.formRegist.three &&
            this.formRegist.four
          ) {
            this.canSubmit = true;
          } else {
            this.canSubmit = false;
          }
        } else {
          if (
            this.formRegist.one &&
            this.formRegist.two &&
            this.formRegist.three &&
            this.formRegist.four &&
            this.formRegist.password
          ) {
            this.canSubmit = true;
          } else {
            this.canSubmit = false;
          }
        }
      },
      deep: true,
    },
  },
  methods: {
    resetTime() {
      let that = this;
      this.interval = setInterval(() => {
        that.time--;
        if (that.time === 0) {
          that.time = 120;
          that.reSendEmailStatus = true;
          clearInterval(that.interval);
          that.timeMsg = "";
        } else {
          that.reSendEmailStatus = false;
          that.timeMsg = that.time;
        }
      }, 1000);
    },
    reSendEmail() {
      if (this.reSendEmailStatus) {
        apiLogin
          .emailCode({
            email: this.registInfo.email,
            type: this.type,
          })
          .then((res) => {
            if (res.code === 200) {
              this.$Message.success("send success");
              this.reSendEmailStatus = false;
              this.resetTime();
            } else {
              this.$Message.warning(res.msg);
            }
          });
      }
    },
    // 注册
    handleRegist() {
      apiLogin
        .regist({
          emailCode:
            this.formRegist.one.toString() +
            this.formRegist.two.toString() +
            this.formRegist.three.toString() +
            this.formRegist.four.toString(),
          ...this.registInfo,
        })
        .then((res) => {
          if (res.code === 200) {
            // 清除注册信息
            localStorage.removeItem("REGIST_INFO");
            this.$Message.success("Successful registration!");
            this.$router.push("login");
          } else {
            this.$Message.warning(res.msg);
          }
        });
    },
    handleRepassword() {
      apiLogin
        .updatePwd({
          emailCode:
            this.formRegist.one.toString() +
            this.formRegist.two.toString() +
            this.formRegist.three.toString() +
            this.formRegist.four.toString(),
          password: this.formRegist.password,
          ...this.registInfo,
        })
        .then((res) => {
          if (res.code === 200) {
            // 清除注册信息
            localStorage.removeItem("REGIST_INFO");
            this.$Message.success("Successful registration!");
            this.$router.push("login");
          } else {
            this.$Message.warning(res.msg);
          }
        });
    },
    modifyEmail() {
      this.$router.push("/SignUp");
    },
  },
  mounted() {
    this.$refs.formRegist && this.$refs.formRegist.resetFields();
    this.$refs.formRePassword && this.$refs.formRePassword.resetFields();
  },
};
</script>
<style scoped lang="scss">
.drag-area {
  margin: 10px 0;
}
.login {
  height: 100%;
  background-color: #fff;
  overflow: hidden;
  color: #1d2129;
}
.other {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.top-content {
  justify-content: space-between;
  width: 100%;
  height: 90px;
  display: flex;
  padding: 0 10px;
  background-color: #fff;
  align-items: center;
  max-width: 1450px;
  margin: 0 auto;
  .logo {
    display: block;
    padding-top: 12px;
  }
  img {
    cursor: pointer;
  }
  // .logo-box {
  //   height: 90px;
  //   line-height: 90px;
  //   margin: 0 auto;

  //   div {
  //     font-size: 20px;
  //     margin-top: 10px;
  //   }
  // }
}
.pending-scan {
  text-align: center;
  color: black;
}
.scanned {
  text-align: center;
  color: green;
}
.quick-logining {
  text-align: center;
  color: red;
}

.login-carousel {
  width: 100%;
  height: 550px;

  .demo-carousel {
    height: 550px;
    width: inherit;
    display: flex;
    justify-content: center;
  }
}

.container {
  position: relative;
  height: 800px;
  min-width: 1280px;
  width: 100%;
  overflow: hidden;
  background: linear-gradient(90deg, #b7f7dc, #00a7c2);
  z-index: 1;

  .inner_wrap {
    width: 1280px;
    margin: 0 auto;
    position: relative;
    height: 100%;
    z-index: 3;
    .main_img {
      position: absolute;
      left: 25px;
      top: 50%;
      transform: translateY(-50%);
      z-index: 3;
    }
    .common-img {
      .img-wrap {
        text-align: center;
        position: relative;
      }
    }
    .el-image {
      display: inline-block;
      overflow: hidden;
    }
  }
  .register {
    position: absolute;
    right: 145px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
  }
  .RegFirst {
    .contain {
      width: 430px;
      margin: 0 auto;
      padding: 20px 30px 30px;
    }
  }
  .boder-box {
    box-sizing: border-box;
  }
}

.form-box {
  width: 350px;
  box-sizing: border-box;
  position: absolute;
  top: 80px;
  right: 15%;
  padding: 20px;
  background: rgba(255, 255, 255, 0.8);

  .account-number {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    font-weight: bold;

    > div:nth-child(2) {
      color: $theme_color;
      cursor: pointer;
    }

    .tab-switch {
      height: 40px;
      font-size: 14px;

      span:nth-child(1) {
        font-size: 16px;
        border-right: 1px solid #ddd;
        padding-right: 10px;
      }

      span:nth-child(2) {
        cursor: pointer;
        padding-left: 10px;

        &:hover {
          color: $theme_color;
        }
      }
    }
  }
}

.verify-con {
  position: absolute;
  right: 16%;
  top: 90px;
  z-index: 10;
}

.other-login {
  > svg {
    cursor: pointer;
    width: 24px;
    margin-right: 10px;
    height: 24px;
  }
}

.register {
  display: flex;

  margin-top: -10px;

  span {
    margin-left: 10px;

    &:hover {
      cursor: pointer;
      color: $theme_color;
    }
  }
}

.foot {
  background: #fff;
  color: #1d2129;
  font-size: 14px;
  margin-top: 20px;
  margin-bottom: 20px;
  text-align: center;
}

.icon-hover {
  cursor: pointer;
}
.fl {
  float: left;
}
.size20 {
  font-size: 20px;
}
.size14 {
  font-size: 14px;
}
.bold {
  font-weight: 700;
}
.margin-tb20 {
  margin-top: 20px;
  margin-bottom: 20px;
}
.link {
  color: #58b6f1;
}
.fr {
  float: right;
}
.bg-white {
  background: #fff;
}
.stepBox {
  display: flex;
  .actionClass {
    border-color: #249fec !important;
    .stepBoxItem {
      background: #249fec;
    }
    &::after {
      background: #249fec;
    }
  }
}
.stepBoxItemBox {
  width: 44px;
  height: 44px;
  border: 1px solid #ddd;
  padding: 5px;
  margin: 0 50px;
  border-radius: 50%;
  position: relative;
  &:first-child {
    &::after {
      content: "";
      width: 70px;
      height: 2px;
      position: absolute;
      right: -80px;
      top: 50%;
    }
  }
}
.stepBoxItem {
  width: 100%;
  height: 100%;
  background: #ddd;
  text-align: center;
  line-height: 32px;
  font-size: 14px;
  color: #fff;
  border-radius: 18px;
}
.private {
  text-decoration: underline;
  color: #608fcf;
}
.size18 {
  font-size: 18px;
}
.margin-b20 {
  margin-bottom: 20px;
}
.margin-t20 {
  margin-top: 20px;
}
.color-f8 {
  color: #f84c4c;
}
.size32 {
  font-size: 32px;
}
.text_btn {
  color: #249fec;
  font-size: 16px;
  text-decoration: underline;
  cursor: pointer;
  text-align: center;
}
.email-validator-formitem {
  &:first-child {
    margin-left: 75px;
  }
  width: 45px;
  display: inline-block;
  margin-left: 10px;
  margin-top: 20px;
  ::v-deep .ivu-input {
    text-align: center;
  }
}
.is-disabled {
  cursor: not-allowed;
}
.disabled-color {
  color: #ccc !important;
}
</style>
