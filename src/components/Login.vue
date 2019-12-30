<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">后台管理系统</div>
      <el-form :model="loginForm" :rules="rules" ref="loginForm" class="ms-content">
        <el-form-item prop="account">
          <el-input v-model="loginForm.account" placeholder="账号" clearable>
            <template slot="prepend" icon="el-icon-lock">
              <i class="el-icon-user"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="密码"
            v-model="loginForm.password"
            show-password
            @keyup.enter.native="submitLogin('loginForm')"
          >
            <template slot="prepend" icon="el-icon-lock">
              <i class="el-icon-lock"></i>
            </template>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitLogin('loginForm')">登录</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        account: "admin",
        password: "123456"
      },
      rules: {
        account: [{ required: true, message: "请输入账户名", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    //登录
    submitLogin(formName) {
      const _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          _this.$axios.post("/api/admin/login", _this.loginForm).then(res => {
            console.log(res.data.token)
            localStorage.token = res.data.token
            localStorage.setItem("ms_account", _this.loginForm.account);
            _this.$router.push("/");
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(../../src/assets/loginbg.jpg);
  background-size: 100%;
}
.ms-login {
  position: absolute;
  left: 55%;
  top: 60%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background-color: #6da4f7;
  overflow: hidden;
}
.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  border-bottom: 1px solid #ddd;
}

.ms-content {
  padding: 40px 30px 30px 30px;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}
</style>