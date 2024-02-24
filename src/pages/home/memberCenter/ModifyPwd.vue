<template>
  <div class="wrapper">
    <card _Title="账户安全" />

    <!--  修改  -->
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
      <FormItem label="Current Password" prop="newPwd">
        <Input
          type="password"
          v-model="formRegister.newPwd"
          clearable
          size="large"
          placeholder="Current Password"
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
</template>

<script>
import { setPwd, updatePwd } from "@/api/account";
import { md5 } from "@/plugins/md5.js";

export default {
  name: "modifyPwd",
  data() {
    return {
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
  mounted() {},
  methods: {
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
.phone {
  text-align: left;
}
</style>
