<template>
  <el-card class="box-card">

    <!-- 设置标题操作日志 -->
    <div slot="header" class="clearfix">
      <span>登录日志</span>
    </div>

    <el-table v-loading="listLoading" :data="list" fit highlight-current-row style="width: 98%; margin-top:30px;">
      <el-table-column align="center" label="ID" >
        <template v-slot="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="登录账号用户名">
        <template v-slot="scope">
          <span>{{ scope.row.loginName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="登录IP地址">
        <template v-slot="scope">
          <span>{{ scope.row.ipAddress}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="登录地点">
        <template v-slot="scope">
          <span>{{ scope.row.loginLocation}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="浏览器类型">
        <template v-slot="scope">
          <span>{{ scope.row.browserType}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作系统类型">
        <template v-slot="scope">
          <span>{{ scope.row.os}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="登录状态">
        <template v-slot="scope">
          <el-tag :type="tagType(scope.row.loginStatus)">
            {{ map[scope.row.loginStatus ] }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作日期">
        <template v-slot="scope">
          <span>{{ scope.row.createTime}}</span>
        </template>
      </el-table-column>

    </el-table>
    <!-- 分页 -->
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

  </el-card>
</template>

<script>

import { fetchLoginLogList } from '@/api/operation'


const TAG = "====sea====> operation/loginlog.vue ====> "

export default {
  name: 'LoginLog',
  created() {
    this.getLoginLogList()
  },
  data() {
    return {
      list: null,
      listLoading: true,
      count: 0,
      listQuery: {
        pageNum: 1,
        pageSize: 10
      },
      map: {
        0: '登录成功',
        1: '登录失败'
      }
    }
  },
  computed: {
    tagType() {
      return function(type) {
        switch (type) {
          case 0:
            return "success";
          case 1:
            return "warning";
        }
      };
    }

  },
  methods: {
    getLoginLogList() {
      this.listLoading = true
      var body = this.listQuery
      fetchLoginLogList({ body }).then(response => {
        console.log(TAG + " response: " + JSON.stringify(response))
        this.list = response.data.result
        this.count = response.data.totalSize
        this.listLoading = false
      })
    },

    handleSizeChange(pageSize) {
      this.listQuery.pageSize = pageSize
      this.getLoginLogList()
    },
    handleCurrentChange(pageNum) {
      this.listQuery.pageNum = pageNum
      this.getLoginLogList()
    }
  }
}
</script>

<style rel="stylesheet/scss" scoped lang="scss">
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
