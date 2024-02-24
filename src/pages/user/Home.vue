<template>
  <div>
    <!-- <BaseHeader></BaseHeader> -->
    <Search></Search>
    <!-- 商品分类 -->
    <cateNav :showAlways="false"></cateNav>

    <div class="container width_1450_auto">
      <Layout class="layoutAll">
        <Sider class="side-bar" ref="side" :collapsed-width="78">
          <Menu
            class="side-menu"
            theme="light"
            width="auto"
            :active-name="$route.name"
            :open-names="['Order Centre', 'Member Centre', 'Account Centre']"
            @on-select="onSelect"
          >
            <div class="user-icon">
              <div class="user-img">
                <img
                  :src="userInfo.avatar"
                  style="width: 100%; height: 100%"
                  v-if="userInfo.avatar"
                  alt
                />
                <Avatar icon="ios-person" class="mb_10" v-else size="96" />
              </div>
              <p class="username">{{ userInfo.nickName }}</p>
              <div class="edit-profile" @click="editProfile">
                <i class="iconfont icon-edit"></i>
                <span>Edit Profile</span>
              </div>
            </div>

            <!--   循环导航栏       -->
            <Submenu
              v-for="(menu, index) in menuList"
              :key="index"
              :name="menu.title"
            >
              <template slot="title" v-if="menu.display">
                <Icon type="location"></Icon>
                <span>{{ menu.title }}</span>
              </template>
              <MenuItem
                v-for="(chlidren, i) in menu.menus"
                :key="i"
                :name="chlidren.path"
                >{{ chlidren.title }}</MenuItem
              >
            </Submenu>
          </Menu>
        </Sider>
        <Layout class="layout ml_10">
          <Content class="content">
            <transition mode="out-in">
              <router-view></router-view>
            </transition>
          </Content>
        </Layout>
      </Layout>
    </div>
  </div>
</template>

<script>
import menuList from "./menu";
import Storage from "@/plugins/storage.js";

export default {
  name: "Home",
  data() {
    return {
      menuList, // 会员中心左侧列表
    };
  },
  computed: {
    userInfo() {
      // 用户信息
      if (Storage.getItem("userInfo")) {
        return JSON.parse(Storage.getItem("userInfo"));
      } else {
        return {};
      }
    },
  },

  methods: {
    // 每次点击左侧bar的callback
    onSelect(name) {
      this.$router.push({ name: name });
    },
    editProfile() {
      this.$router.push({ name: "Profile" });
    },
  },
};
</script>

<style scoped lang="scss">
.content {
  padding: 15px 50px;
}

.header {
  @include background_color($light_background_color);
}

.side-menu,
.side-bar,
.content {
  @include white_background_color();
  @include title_color($light_title_color);
}

.side-bar {
  min-height: 600px;
  height: auto;
}

.layoutAll {
  @include background_color($light_background_color);
}

.container {
  margin: 0 auto;
  padding: 20px 0;
}

.side-bar a {
  @include title_color($light_title_color);
}

.user-icon {
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.user-img {
  width: 96px;
  height: 96px;
  border-radius: 48px;
  overflow: hidden;
}

.layout-footer-center {
  padding: 0px 15px;

  padding-bottom: 15px;
  text-align: center;
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
</style>
