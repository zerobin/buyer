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
        <div class="stepBoxItemBox">
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
          <div class="RegFirst">
            <div class="contain bg-white boder-box">
              <div class="title size20 bold">SIGN UP</div>
              <p class="size14 reg_tip">
                Already Have an Account?
                <a class="theme_color" @click="$router.push('login')"
                  >Sign In</a
                >
              </p>
              <div>
                <Form
                  ref="formRegist"
                  :model="formRegist"
                  :rules="ruleInline"
                  style="width: 300px"
                >
                  <FormItem prop="userName">
                    <i-input
                      type="text"
                      v-model="formRegist.userName"
                      clearable
                      placeholder="Name"
                      size="large"
                    >
                    </i-input>
                  </FormItem>
                  <FormItem prop="email">
                    <i-input
                      type="text"
                      v-model="formRegist.email"
                      clearable
                      placeholder="Email"
                      size="large"
                    >
                    </i-input>
                  </FormItem>
                  <FormItem prop="country">
                    <!-- <i-input
                      type="text"
                      v-model="formRegist.country"
                      clearable
                      placeholder="Country"
                    >
                    </i-input> -->
                    <Select
                      v-model="formRegist.country"
                      filterable
                      size="large"
                      placeholder="Country Name"
                    >
                      <Option
                        v-for="item in cityList"
                        :value="item.countryNameEn"
                        :key="item.id"
                        >{{ item.countryNameEn }}</Option
                      >
                    </Select>
                  </FormItem>
                  <FormItem prop="password">
                    <i-input
                      type="password"
                      v-model="formRegist.password"
                      clearable
                      placeholder="Password"
                      size="large"
                    >
                    </i-input>
                  </FormItem>
                  <FormItem prop="confirmPassword">
                    <i-input
                      type="password"
                      v-model="formRegist.confirmPassword"
                      clearable
                      placeholder="confirmPassword"
                      size="large"
                    >
                    </i-input>
                  </FormItem>
                  <FormItem prop="mobilePhone">
                    <i-input
                      type="text"
                      v-model="formRegist.mobilePhone"
                      clearable
                      placeholder="phone"
                      size="large"
                    >
                    </i-input>
                  </FormItem>
                  <FormItem>
                    <Checkbox v-model="single"></Checkbox>I agree to the
                    <a class="private" @click="gotoPrivate"
                      >Terms and Private Policy</a
                    >
                  </FormItem>
                  <FormItem>
                    <Button
                      style="font-size: 16px; height: 46px; font-weight: 700"
                      type="info"
                      @click="handleRegist"
                      long
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
import { city } from "@/assets/data/city";
export default {
  name: "SignUp",
  data() {
    return {
      cityList: city,
      config: require("@/config"),
      year: new Date().getFullYear(),
      single: true,
      canSubmit: false,
      formRegist: {
        // 注册表单
        mobilePhone: "",
        userName: "",
        password: "",
        confirmPassword: "",
        email: "",
        country: "",
      },
      ruleInline: {
        // 验证规则
        userName: [{ required: true, message: "Please enter your name" }],
        country: [
          { required: true, message: "Please enter country", trigger: "blur" },
        ],
        email: [
          { required: true, message: "Please enter your email" },
          {
            pattern: RegExp.email,
            message: "Please enter the correct email format",
          },
        ],
        password: [{ required: true, message: "Please enter your password" }],
        mobilePhone: [
          {
            pattern: RegExp.mobile,
            trigger: "blur",
            message: "Please enter the correct cell phone number",
          },
        ],
        confirmPassword: [
          { required: true, message: "Please confirm your password" },
          {
            validator: (rule, value, callback) => {
              // 上面有说，返回true表示校验通过，返回false表示不通过
              return value === this.formRegist.password;
            },
            trigger: "blur",
            message: "The two passwords do not match",
          },
        ],
      },
      interval: "", // 定时器
      time: 60, // 倒计时
    };
  },
  watch: {
    // formRegist: {
    //   handler(val) {
    //     this.$refs.formRegist.validate((valid) => {
    //       if (valid && this.single) {
    //         this.canSubmit = true;
    //       } else {
    //         this.canSubmit = false;
    //       }
    //     });
    //   },
    //   deep: true,
    // },
  },
  methods: {
    // 注册
    handleRegist() {
      this.$refs.formRegist.validate((valid) => {
        if (!this.single) {
          this.$Message.error(
            "Please agree to the terms and privacy policy first"
          );
          return;
        }
        if (valid) {
          localStorage.setItem("REGIST_INFO", JSON.stringify(this.formRegist));
          apiLogin
            .emailCode({
              email: this.formRegist.email,
              type: 0,
            })
            .then((res) => {
              if (res.code === 200) {
                this.$router.push({
                  path: "/emailValidator",
                });
              } else {
                this.$Message.warning(res.msg);
              }
            });
        }
      });
    },
    gotoPrivate() {
      // this.$router.push("/agreement");
      window.open(
        location.protocol + "//" + location.host + "/agreement",
        "_blank"
      );
    },
  },
  created() {
    this.formRegist = JSON.parse(localStorage.getItem("REGIST_INFO")) || {
      mobilePhone: "",
      userName: "",
      password: "",
      confirmPassword: "",
      email: "",
      country: "",
    };
  },
  mounted() {
    this.$refs.formRegist.resetFields();
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
.is-disabled {
  cursor: not-allowed;
}
</style>
