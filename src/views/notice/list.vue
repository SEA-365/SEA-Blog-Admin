<template>
  <el-card class="box-card">

    <el-table v-loading="listLoading" :data="list" fit highlight-current-row style="width: 98%; margin-top:30px;">
      <el-table-column align="center" label="ID" >
        <template v-slot="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="公告标题">
        <template v-slot="scope">
          <span>{{ scope.row.noticeTitle}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="公告类型">
        <template v-slot="scope">
          <el-tag :type="noticeType(scope.row.noticeType)">
            {{ map_type[scope.row.noticeType ] }}
          </el-tag>
        </template>
      </el-table-column>


      <el-table-column align="center" label="公告状态">
        <template v-slot="scope">
          <el-tag :type="noticeStatus(scope.row.noticeStatus)">
            {{ map_status[scope.row.noticeStatus ] }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="公告内容">
        <template v-slot="scope">
          <span>{{ scope.row.noticeContent}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建者">
        <template v-slot="scope">
          <span>{{ scope.row.creator}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间">
        <template v-slot="scope">
          <span>{{ scope.row.createTime}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="更新时间">
        <template v-slot="scope">
          <span>{{ scope.row.updateTime}}</span>
        </template>
      </el-table-column>


      <el-table-column align="center" label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit"  @click="$router.push({ name: 'NoticeAdd', params: { noticeId: scope.row.id }})">编辑</el-button>
          <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteNotice(scope.row.id)">删除</el-button>
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
import { getNoticeList, getNoticeById, deleteNoticeById, updateNotice, addNotice} from "@/api/notice";

const TAG = "====sea====> notice/list.vue ====> "

export default {
  name: 'NoticeList',

  created() {
    this.noticeList()
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
      noticeForm: {
        id: null,
        noticeTitle: '',
        noticeType: 0,
        noticeStatus: 0,
        noticeContent: '',
        creator: ''
      },
      map_type: {
        0: '公告',
        1: '通知',
        2: '提醒'
      },
      map_status: {
        0: '正常',
        1: '关闭'
      },
    }
  },
  computed: {
    noticeType() {
      return function(type) {
        switch (type) {
          case 0:
            return "warning";
          case 1:
            return "danger";
          case 2:
            return "primary";
        }
      };
    },
    noticeStatus() {
      return function(status) {
        switch (status) {
          case 0:
            return "success";
          case 1:
            return "danger";
        }
      };
    }
  },
  methods: {
    noticeList(){
      this.listLoading = true
      var body = this.listQuery;
      getNoticeList({ body }).then(response => {
        console.log(TAG + " response: " + JSON.stringify(response))
        this.list = response.data.result
        this.count = response.data.totalSize
        this.listLoading = false
      })
    },

    handleSizeChange(pageSize) {
      this.listQuery.pageSize = pageSize
      this.noticeList()
    },
    handleCurrentChange(pageNum) {
      this.listQuery.pageNum = pageNum
      this.noticeList()
    },
    deleteNotice (id) {
      this.$confirm('此操作将永久删除该公告, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteNoticeById(id).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          //删除后，重新获取公告列表
          this.noticeList()
        }).catch(() => {
          console.log('error')
        })
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '你已经取消删除该公告！'
        })
      })
    },
    openModel(notice) {
      if (notice != null) {
        this.noticeForm = JSON.parse(JSON.stringify(notice));
        this.$refs.noticeTitle.innerHTML = "修改公告";
      } else {
        this.noticeForm.id = null;
        this.noticeForm.noticeTitle = "";
        this.noticeForm.noticeType = 0;
        this.noticeForm.noticeStatus = 0;
        this.noticeForm.noticeContent = '';
        this.noticeForm.creator = '';
        this.$refs.noticeTitle.innerHTML = "添加公告";
      }
      this.addOrUpdateDialogVisible = true;
    },
    addOrEditNotice() {
      var body = this.noticeForm;
      if(body.id == null){
        addNotice(body).then(response => {
          this.$message({
            type: 'success',
            message: '添加公告成功!'
          })
          //重新获取公告列表
          this.noticeList()
        }).catch(() => {
          console.log('error')
        })
      } else {
        updateNotice(body).then(response => {
          this.$message({
            type: 'success',
            message: '修改公告成功!'
          })
          this.noticeList()
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
