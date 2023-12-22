<template>
  <el-card class="box-card">

    <el-button
      type="primary"
      size="small"
      icon="el-icon-plus"
      @click="openModel(null)"
    >
      新增
    </el-button>

    <el-table v-loading="listLoading" :data="list" fit highlight-current-row style="width: 98%; margin-top:30px;">
      <el-table-column align="center" label="ID" >
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="用户名">
        <template slot-scope="scope">
          <span>{{ scope.row.username}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="密码">
        <template slot-scope="scope">
          <span>{{ scope.row.password}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="邮箱">
        <template slot-scope="scope">
          <span>{{ scope.row.email}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="手机号">
        <template slot-scope="scope">
          <span>{{ scope.row.phone}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="性别">
        <template slot-scope="scope">
          <span>{{ scope.row.gender}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="个人介绍">
        <template slot-scope="scope">
          <span>{{ scope.row.intro}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="头像url">
        <template slot-scope="scope">
          <span>{{ scope.row.avatarUrl}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="更新时间">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="openModel(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteUser(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>


    </el-table>

    <el-pagination
      class="pagination-container"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="this.listQuery.pageNum"
      :page-size="this.listQuery.pageSize"
      :total="count"
      :page-sizes="[10, 20, 30]"
      layout="total, sizes, prev, pager, next, jumper"
    />


    <!-- 添加/编辑对话框 -->
    <el-dialog :visible.sync="addOrUpdateDialogVisible" width="30%">
      <div class="dialog-title-container" slot="title" ref="userTitle" />
      <el-form label-width="80px" size="medium" :model="userForm">
        <el-form-item label="用户名">
          <el-input v-model="userForm.username" style="width:220px" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="userForm.password" style="width:220px" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="userForm.email" style="width:220px" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="userForm.phone" style="width:220px" />
        </el-form-item>
        <el-form-item label="性别">
          <el-input v-model="userForm.gender" style="width:220px" />
        </el-form-item>
        <el-form-item label="个人介绍">
          <el-input v-model="userForm.intro" style="width:220px" />
        </el-form-item>
        <el-form-item label="头像url">
          <el-input v-model="userForm.avatarUrl" style="width:220px" />
        </el-form-item>

      </el-form>
      <div slot="footer">
        <el-button @click="addOrUpdateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrEditUser">
          确 定
        </el-button>
      </div>
    </el-dialog>

  </el-card>
</template>
<script>
import { getUserList, getUserById, deleteUserById, updateUser, addUser} from "@/api/user";


export default {
  name: 'UserList',

  created() {
    this.userList()
  },

  data(){
    return {
      list: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      addOrUpdateDialogVisible: false,
      count: 0,
      userForm: {
        id: null,
        username: '',
        password: '',
        email: '',
        phone: '',
        gender: '',
        intro: '',
        avatarUrl: ''
      }
    }
  },
  methods: {
    userList(){
      this.listLoading = true
      var body = this.listQuery
      getUserList(body).then(response => {
        this.list = response.data
        this.count = response.data.totalSize
        this.listLoading = false
      })
    },

    handleSizeChange(pageSize) {
      this.listQuery.pageSize = pageSize
      this.userList()
    },
    handleCurrentChange(pageNum) {
      this.listQuery.pageNum = pageNum
      this.userList()
    },
    deleteUser (id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUserById(id).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          //删除后，重新获取用户列表
          this.userList()
        }).catch(() => {
          console.log('error')
        })
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '你已经取消删除该用户！'
        })
      })
    },
    openModel(user) {
      if (user != null) {
        this.userForm = JSON.parse(JSON.stringify(user));
        this.$refs.userTitle.innerHTML = "修改用户";
      } else {
        this.userForm.id = null;
        this.userForm.username = "";
        this.userForm.password = "";
        this.userForm.email = "";
        this.userForm.phone = "";
        this.userForm.gender = "";
        this.userForm.intro = "";
        this.userForm.avatarUrl = "";
        this.$refs.userTitle.innerHTML = "添加用户";
      }
      this.addOrUpdateDialogVisible = true;
    },
    addOrEditUser() {
      var body = this.userForm;
      if(body.id == null){
        addUser(body).then(response => {
          this.$message({
            type: 'success',
            message: '添加用户成功!'
          })
          //重新获取用户列表
          this.userList()
        }).catch(() => {
          console.log('error')
        })
      } else {
        updateUser(body).then(response => {
          this.$message({
            type: 'success',
            message: '修改用户成功!'
          })
          this.userList()
        }).catch(() => {
          console.log('error')
        })
      }
      this.addOrUpdateDialogVisible = false;
    }
  }

}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.pagination-container {
  float: right;
  margin-top: 1.25rem;
  margin-bottom: 1.25rem;
}

.box-card {
  width: 98%;
  margin: 1%;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}
.clearfix span {
  font-weight: 600;
}

</style>
