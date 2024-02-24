<template>
  <div class="login" @keyup.enter="handleSubmit('formInline')">
    <!-- 顶部logo -->
    <div class="top-content" @click="$refs.verify.show = false">
      <a class="logo" href=""
        ><img :src="$store.state.logoImg" @click="$router.push('/')"
      /></a>
    </div>
    <!-- 登录主体 包含轮播图 登录模块 -->
    <div class="container">协议</div>
    <div class="foot">
      Copyright © {{ year }} ELEK Technology Co., Ltd. All Rights Reserved.
    </div>
  </div>
</template>

<script></script>
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
  background: #fff;
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
