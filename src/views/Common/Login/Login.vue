<template>
  <section class="login">
    <el-form
      label-position="right"
      label-width="80px"
      :model="form"
      :rules="rules"
      ref="form"
      @submit.native.prevent
    >
      <el-form-item label="用户名" prop="userName">
        <el-input prefix-icon="el-icon-user-solid" v-model.trim="form.userName" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input prefix-icon="el-icon-lock" v-model.trim="form.password" type="password" placeholder="请输入密码" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit" @click="submitForm('form')" size="small">登录</el-button>
        <el-button @click="resetForm('form')" size="small">重置</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
  import api from "@/axios/ajax"
  import ApiPath from "@/apis/api-path"
  import { formValidate }from "@/mixins/form-validate-mixin"

  export default {
    name: 'Login',
    mixins: [formValidate],
    data() {
      return {
        form: {},
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$store.dispatch("loginAction", this.form).then(() => {
              this.$router.replace(ApiPath.home.onHome)
            }).catch(err => {
              this.$message.error(err.message)
            })
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>

<style scoped lang="scss">
  .login {
    position: relative;
    height: 100%;
    background: rgb(84, 92, 100);
  }
  .el-form {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 20px;
    border-radius: 10px;
    background: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
</style>
