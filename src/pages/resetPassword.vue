<template>
  <div class="login" @keyup.enter="handleSubmit('formInline')">
    <!-- 顶部logo -->
    <div class="top-content">
      <a class="logo" href=""
        ><img :src="$store.state.logoImg" @click="$router.push('/')"
      /></a>
    </div>
    <!-- 登录主体 包含轮播图 登录模块 -->
    <div class="container">
      <div class="mask"></div>
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
        <div class="LogLayout boder-box clearfix">
          <div class="fl left_zone"></div>
          <div class="fl right_zone">
            <div class="title size20 bold">Reset Your Password</div>
            <p class="size14 reg_tip">Please enter a new password.</p>
            <div>
              <Form
                ref="formInline"
                :model="formData"
                :rules="ruleInline"
                v-show="type === true"
              >
                <FormItem prop="password">
                  <i-input
                    type="password"
                    v-model="formData.password"
                    clearable
                    placeholder="Password"
                  >
                  </i-input>
                </FormItem>

                <FormItem prop="confirmPassword">
                  <i-input
                    type="password"
                    v-model="formData.confirmPassword"
                    clearable
                    placeholder="confirmPassword"
                  >
                  </i-input>
                </FormItem>

                <FormItem>
                  <Button
                    style="font-size: 16px; height: 46px; font-weight: 700"
                    type="info"
                    @click.stop="handleSubmit('formInline')"
                    long
                    >submit</Button
                  >
                </FormItem>
              </Form>
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
import storage from "@/plugins/storage.js";

export default {
  name: "Login",

  data() {
    return {
      qrCodeStatus: "success", //
      qrCode: "",
      qrSessionToken: "",
      //是否是二维码登录
      scannerCodeLoginStatus: 0,
      qrCodeTimer: null,
      config: require("@/config"),
      type: true, // true 账号登录  false 验证码登录
      formData: {
        // 登录表单
        email: "",
        password: "",
      },

      ruleInline: {
        password: [{ required: true, message: "Please enter your password" }],
        confirmPassword: [
          { required: true, message: "Please confirm your password" },
          {
            validator: (rule, value, callback) => {
              return value === this.formRegist.password;
            },
            trigger: "blur",
            message: "The two passwords do not match",
          },
        ],
      },
      codeMsg: "发送验证码", // 验证码文字
      interval: null, // 定时器
      time: 60, // 倒计时
      year: new Date().getFullYear(),
    };
  },
  watch: {},
  methods: {
    // 登录
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if (this.type) {
            this.login();
          } else {
          }
        }
      });
    },
    login() {
      apiLogin.login(this.formData).then((res) => {
        if (res.code === 200) {
          this.$router.push({ path: "/" });
        } else {
          console.log(this.$Message, "--");
          this.$Message.warning(res.msg);
        }
      });
    },
  },
  mounted() {},
  watch: {
    type(v) {
      if (v) {
        this.$refs.formInline.resetFields();
      } else {
        this.$refs.formSms.resetFields();
      }
    },
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
  .mask {
    position: absolute;
    width: 100%;
    height: 100%;
    min-width: 1280px;
    background-color: hsla(0, 0%, 100%, 0.7);
    z-index: 2;
  }
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
  .LogLayout {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 1120px;
    height: 520px;
    transform: translate(-50%, -50%);
    background-color: #fff;
    border-radius: 18px;
    overflow: hidden;
    .left_zone {
      width: 50%;
      height: 100%;
      background: linear-gradient(25deg, #a2eed9, #4ec9cd);
    }
    .right_zone {
      width: 50%;
      height: 100%;
      box-sizing: border-box;
      padding: 65px 105px;
      position: relative;
    }
    .title {
      margin-bottom: 30px;
    }
    .reg_tip {
      position: absolute;
      left: 105px;
      top: 100px;
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
</style>
