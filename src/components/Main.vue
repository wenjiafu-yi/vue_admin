<template>
  <el-container>
    <el-header>
      <div class="logo">后台管理系统</div>
      <div class="header-right">
        <div class="header-user-con">
          <!-- 用户头像 -->
          <div class="user-avator">
            <img src="https://wxt.sinaimg.cn/large/007YHpaNgy1g79i6f32nej305006oq37.jpg" />
          </div>
          <!-- 用户名下拉菜单 -->
          <el-dropdown class="user-name" @command="handleCommand">
            <span class="el-dropdown-link">
              {{username}}
              <i class="el-icon-caret-bottom"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="loginout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </el-header>

    <el-container>
      <el-aside width="200px" style="background-color: rgb(238, 241, 246);height:100vh">
        <el-menu router unique-opened :default-active="$route.path">
          <el-menu-item index="/home">
            <i class="el-icon-s-home"></i>
            <span slot="title">首页</span>
          </el-menu-item>

          <el-menu-item index="/usermanagement">
            <i class="el-icon-s-custom"></i>
            <span slot="title">用户信息管理</span>
          </el-menu-item>

          <el-submenu index>
            <template slot="title">
              <i class="el-icon-s-tools"></i>
              <span slot="title">系统设置</span>
            </template>
            <template>
              <el-menu-item index="/modifypassword">修改密码</el-menu-item>
              <el-menu-item index="/introduction">系统简介</el-menu-item>
            </template>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-main>
        <router-view :key="$route.path"></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      name: "lunxun"
    };
  },
  computed: {
    username() {
      let username = localStorage.getItem("ms_account");
      if (!username) {
        return this.name;
      }
      return username;
    }
  },
  methods: {
    // 用户名下拉菜单选择事件
    handleCommand(command) {
      if (command == "loginout") {
        localStorage.clear();
        this.$router.push("/login");
      }
    }
  }
};
</script>

<style>
.el-header {
  position: relative;
  box-sizing: border-box;
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
  width: 100%;
  height: 60px;
  font-size: 22px;
}
.logo {
  float: left;
  margin-left: 10px;
  width: 250px;
  line-height: 60px;
}
.header-right {
  float: right;
  padding-right: 40px;
}
.header-user-con {
  display: flex;
  height: 60px;
  align-items: center;
}
.user-name {
  margin-left: 10px;
}
.user-avator {
  margin-left: 20px;
}
.user-avator img {
  display: block;
  width: 35px;
  height: 35px;
  border-radius: 50%;
}
.el-dropdown-link {
  color: #fff;
  cursor: pointer;
}
.el-aside {
  color: #333;
}
</style>