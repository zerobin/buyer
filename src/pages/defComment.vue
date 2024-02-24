<!--
 * @Date: 2024-02-17 15:50:09
 * @LastEditors: 庄鸿斌
 * @LastEditTime: 2024-02-18 22:52:27
-->
<template>
  <div class="">
    <div v-if="isShow">
      <div class="panel">
        <p class="title">
          <span>Welcome to Elekworld! </span><br />
          Thanks for visiting our website, in order to provide better experience
          to you, your kindly feedback will be highly appreciated and helpful
          for us to improve our service. Look forward to supporting you more in
          future!
        </p>
        <div class="contail">
          <div class="main">
            <Form
              :model="formItem"
              :rules="rules"
              ref="form"
              label-position="top"
            >
              <FormItem label="Email OR whatsApp" prop="type">
                <Select
                  v-model="formItem.type"
                  filterable
                  size="large"
                  placeholder="Select Type"
                  style="width: 250px"
                >
                  <Option
                    v-for="item in typeList"
                    :value="item.value"
                    :key="item.key"
                    >{{ item.key }}</Option
                  >
                </Select>
              </FormItem>

              <FormItem
                label="Email"
                prop="email"
                v-if="formItem.type === 'Email'"
              >
                <Input
                  size="large"
                  class="wrapper-user-name"
                  v-model="formItem.email"
                  placeholder="email"
                  style="width: 250px"
                />
              </FormItem>
              <FormItem
                label="whatsApp"
                prop="whatsApp"
                v-if="formItem.type === 'whatsApp'"
              >
                <Input
                  size="large"
                  class="wrapper-user-name"
                  v-model="formItem.whatsApp"
                  placeholder="whatsApp"
                  style="width: 250px"
                />
              </FormItem>

              <FormItem label="Detail" prop="content">
                <Input
                  size="large"
                  class="wrapper-user-name"
                  v-model="formItem.content"
                  placeholder="content"
                  style="width: 250px"
                  type="textarea"
                  :rows="4"
                />
              </FormItem>
              <FormItem label="img">
                <div class="upload-list" v-for="item in formItem.url">
                  <img :src="item" />
                  <div class="upload-list-cover">
                    <Icon
                      type="ios-eye-outline"
                      @click.native="handleView(item)"
                    ></Icon>
                    <Icon
                      type="ios-trash-outline"
                      @click.native="handleRemove(item)"
                    ></Icon>
                  </div>
                </div>
                <Upload
                  ref="upload"
                  multiple
                  :show-upload-list="false"
                  :on-success="handleSuccess"
                  :on-format-error="handleFormatError"
                  :format="['jpg', 'jpeg', 'png']"
                  :action="action"
                  :headers="accessToken"
                  type="drag"
                  style="display: inline-block; width: 58px"
                >
                  <!-- <Button class="mt_10">上传头像</Button> -->
                  <div style="width: 58px; height: 58px; line-height: 58px">
                    <Icon type="ios-camera" size="20"></Icon>
                  </div>
                </Upload>
              </FormItem>
            </Form>
          </div>
          <p class="submit-btn">
            <Icon type="md-send" color="#fff" size="24" />
            <span @click="submit">Submit</span>
          </p>
        </div>
      </div>
      <div class="tawk-min-container tawk-button" @click="toggle">
        <Icon type="ios-close" size="60" color="#fff" />
      </div>
    </div>
    <div v-else @click="toggle">
      <div class="tawk-min-container tawk-button">
        <img
          class="img-comment"
          src="../assets/images/comment.png"
          alt="warranty process"
        />
      </div>
    </div>
    <Modal title="View Image" v-model="visible">
      <img :src="imgUrl" v-if="visible" style="width: 100%" />
    </Modal>
  </div>
</template>
<script>
import { email } from "@/plugins/RegExp";
import { apiFeedbackSave } from "@/api/comment";
import { commonUrl } from "@/plugins/request.js";
export default {
  data() {
    return {
      imgUrl: "",
      visible: false,
      isShow: false,
      formItem: { url: [] }, // 表单数据
      action: commonUrl + "/public/c/upload", // 上传接口
      accessToken: {}, // 验证token
      typeList: [
        {
          key: "Email",
          value: "Email",
        },
        {
          key: "whatsApp",
          value: "whatsApp",
        },
      ],
      rules: {
        type: [{ required: true, message: "Select", trigger: "change" }],
        // 验证规则
        content: [{ required: true, message: "Please enter comment" }],
        email: [
          { required: true, message: "Please enter email", trigger: "blur" },
          {
            message: "Please right email",
            pattern: email,
          },
        ],
        whatsApp: [
          {
            required: true,
            message: "Please enter whatsApp",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    handleSuccess(res, file) {
      // 上传成功

      console.log(res, "====");
      if (res.code === 200) {
        file.url = res.msg;
        this.formItem.url.push(res.msg);
      } else {
        this.$Message.error(res.msg);
      }
      // this.$set(this.formItem, "url", res.msg);
    },
    handleFormatError(file) {
      this.$Message.error(
        "The file format is incorrect, File format of " +
          file.name +
          " is incorrect, please select agin"
      );
    },

    handleView(item) {
      this.imgUrl = item;
      this.visible = true;
    },
    handleRemove(file) {
      console.log(file);
      const fileList = this.$refs.upload.fileList;
      let index = fileList.findIndex((item) => {
        return (item.url = file);
      });
      this.$refs.upload.fileList.splice(index, 1);
      this.formItem.url.splice(index, 1);
    },
    toggle() {
      this.isShow = !this.isShow;
    },
    submit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.formItem.url = this.formItem.url.join();
          apiFeedbackSave(this.formItem)
            .then((res) => {
              if (res.code === 200) {
                this.$Message.success("success");
                this.formItem = { url: [] };
                this.isShow = false;
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
.tawk-min-container {
  bottom: 30px;
  right: 30px;
  position: fixed;
  z-index: 1000;
  border: 0px;
  cursor: pointer;
  padding: 0;
}
.tawk-button {
  width: 60px;
  height: 60px;
  line-height: 3.75rem;
  background: #ff5e5e;
  text-align: center;
  border-radius: 100%;
}
.img-comment {
  width: 45px;
  height: 45px;
  border-radius: 100%;
  position: relative;
  top: 8px;
}
.panel {
  width: 350px;
  bottom: 100px;
  right: 20px;
  min-height: 300px;
  position: fixed;
  z-index: 1000000;
  background: #fff;
  border-radius: 5px;
}
.title {
  width: 100%;
  font-size: 14px;
  padding: 20px 20px 40px;
  background: #ff5e5e;
  color: #fff;
  span {
    font-size: 18px;
  }
}
.contail {
  margin: 0 20px;
  border-radius: 8px;
  height: 500px;
  overflow: scroll;
  position: relative;
  background: #fff;
  padding: 10px 20px;
  top: -20px;
}
.submit-btn {
  background: #ff5e5e;
  margin: 0 auto;
  height: 42px;
  line-height: 42px;
  text-align: center;
  border-radius: 6px;
  cursor: pointer;
  span {
    font-size: 18px;
    display: inline-block;
    margin-left: 10px;
    color: #fff;
  }
}
.upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
  img {
    width: 100%;
    height: 100%;
  }
}
.upload-list-cover {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
}
</style>
