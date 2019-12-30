<template>
  <div class="user">
    <el-row>
      <el-col :span="24">
        <el-input
          placeholder="请输入内容"
          class="input-with-select search-input"
          v-model="select_word"
          @keydown.native.enter="search"
        >
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
        <el-button type="success" plain @click="addDialogFormVisible=true">添加用户</el-button>
      </el-col>
    </el-row>
    <el-table :data="userList" style="width: 100%">
      <el-table-column prop="username" label="姓名" width="100"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
      <el-table-column prop="createtime" label="创建时间" width="180"></el-table-column>
      <el-table-column prop="logintime" label="登录时间" width="180"></el-table-column>
      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.state" @change="changeUserState(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="showEditDialog(scope.row)"
          ></el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteUser(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <dir class="page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="1"
        :page-sizes="[5, 10, 30, 40]"
        :page-size="4"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </dir>
    <!-- 添加用户对话框   -->
    <el-dialog title="添加用户" :visible.sync="addDialogFormVisible">
      <el-form :model="addForm" label-width="80px" ref="addUserForm" :rules="rules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" :visible.sync="editDialogFormVisible">
      <el-form :model="editForm" label-width="80px" ref="editUserForm" :rules="rules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" auto-complete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editForm.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import moment from "moment";
export default {
  data() {
    var validateEmail = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入邮箱"));
      } else if (
        !/^[a-z0-9A-Z]+([-|_|\.]+[a-z0-9A-Z]+)*@([a-z0-9A-Z]+[-|\.])+[a-zA-Z]{2,5}$/.test(
          this.addForm.email
        )
      ) {
        callback(new Error("请输入正确的邮箱"));
      } else {
        callback();
      }
    };
    var validatePhone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入手机号"));
      } else if (!/^1[34578]\d{9}$/.test(this.addForm.mobile)) {
        callback(new Error("请输入正确的手机号"));
      } else {
        callback();
      }
    };
    return {
      userList: [],
      total: 0,
      pagesize: 5,
      pagenum: 1,
      select_word: "",
      num: 4,
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      addDialogFormVisible: false,
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        email: [{ validator: validateEmail, trigger: "blur" }],
        mobile: [{ validator: validatePhone, trigger: "blur" }]
      },
      editForm: {
        username: "",
        email: "",
        mobile: "",
        id: ""
      },
      editDialogFormVisible: false,
      roleId: "",
      roleList: []
    };
  },
  mounted() {
    this.initList();
  },
  methods: {
    //用户状态
    handleSizeChange(val) {
      this.pagesize = val;
      this.initList();
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.initList();
    },
    // 获取用户列表信息
    initList() {
      this.$axios.get("/api/admin/userList").then(res => {
        if (res.data.code == "500") {
          var list = [];
          for (let j = 0, len = res.data.results.length; j < len; j++) {
            if (res.data.results[j].state === 1) {
              res.data.results[j].state = true;
              res.data.results[j].createtime = moment(
                res.data.results[j].createtime
              ).format("YYYY-MM-DD HH:mm:ss");
              res.data.results[j].logintime = moment(
                res.data.results[j].logintime
              ).format("YYYY-MM-DD HH:mm:ss");
              list.push(res.data.results[j]);
            } else {
              res.data.results[j].state = false;
              res.data.results[j].createtime = moment(
                res.data.results[j].createtime
              ).format("YYYY-MM-DD HH:mm:ss");
              res.data.results[j].logintime = moment(
                res.data.results[j].logintime
              ).format("YYYY-MM-DD HH:mm:ss");
              list.push(res.data.results[j]);
            }
          }
          this.userList = list;
        }
      });
    },
    // 改变用户状态
    changeUserState(row) {
      console.log(row.state);
      this.$axios
        .post("/api/admin/userState", { id: row.id, state: row.state })
        .then(res => {
          if (res.status === 200) {
            this.initList();
            this.$message({
              type: "success",
              message: "用户状态修改成功"
            });
          }
        });
    },

    // 添加用户
    addUserSubmit() {
      this.$refs.addUserForm.validate(valid => {
        if (valid) {
          this.$axios.post("/api/admin/addUser", this.addForm).then(res => {
            if (res.status === 200) {
              this.$message({
                type: "success",
                message: "添加用户成功"
              });
              this.initList();
              this.addDialogFormVisible = false;
            }
          });
        } else {
          return false;
        }
      });
    },

    // 打开编辑窗口
    showEditDialog(row) {
      this.editForm = Object.assign({}, row);
      console.log(this.editForm);
      this.editDialogFormVisible = true;
    },

    // 编辑用户
    editUserSubmit() {
      this.$refs.editUserForm.validate(valide => {
        if (valide) {
          this.$axios.post("/api/admin/updateUser", this.editForm).then(res => {
            if (res.status === 200) {
              this.initList();
              this.$message({
                type: "success",
                message: "修改成功"
              });
              this.editDialogFormVisible = false;
            }
          });
        }
      });
    },

    // 删除用户
    deleteUser(row) {
      console.log(row);
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          console.log(row.id);
          this.$axios
            .post("/api/admin/deleteUser", { id: row.id })
            .then(res => {
              if (res.status === 200) {
                this.initList();
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    //搜索
    search() {
      var self = this;
      if (this.select_word) {
        self.$axios
          .post("/api/admin/searchUser", {
            username: this.select_word
          })
          .then(res => {
            if (res.data.results) {
              this.userList = res.data.results;
              self.$message({
                message: "查找成功",
                type: "success"
              });
            } else {
              self.$message({
                message: "用户不存在",
                type: "error"
              });
            }
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        this.initList();
      }
    }
  }
};
</script>
<style scoped>
.search-input {
  width: 300px;
}
.page {
  padding: 5px 0;
  background-color: #d3dce6;
}
</style>