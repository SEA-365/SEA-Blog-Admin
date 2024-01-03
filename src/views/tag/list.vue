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
        <template v-slot="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="标签名称">
        <template v-slot="scope">
          <span>{{ scope.row.tagName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="标签创建时间">
        <template v-slot="scope">
          <span>{{ scope.row.createTime}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="上次修改时间">
        <template v-slot="scope">
          <span>{{ scope.row.updateTime}}</span>
        </template>
      </el-table-column>


      <el-table-column align="center" label="操作" width="180">
        <template v-slot="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="openModel(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteTag(scope.row.id)">删除</el-button>
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


    <!-- 添加/编辑对话框 -->
    <el-dialog :visible.sync="addOrUpdateDialogVisible" width="30%">
      <div class="dialog-title-container" slot="title" ref="tagTitle" />
      <el-form label-width="80px" size="medium" :model="tagForm">
        <el-form-item label="标签id">
          <el-input v-model="tagForm.id" style="width:80%" />
        </el-form-item>

      </el-form>

      <el-form label-width="80px" size="medium" :model="tagForm">
        <el-form-item label="标签名称">
          <el-input v-model="tagForm.tagName" style="width:80%" />
        </el-form-item>

      </el-form>
      <div slot="footer">
        <el-button @click="addOrUpdateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrEditTag">
          确 定
        </el-button>
      </div>
    </el-dialog>

  </el-card>
</template>
<script>
import { getTagList, getTagById, deleteTagById, updateTag, addTag} from "@/api/tag";

const TAG = "====sea====> tag/list.vue ====> "

export default {
  name: 'TagList',

  created() {
    this.tagList()
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
      tagForm: {
        id: null,
        tagName: '',
      }
    }
  },
  methods: {
    tagList(){
      this.listLoading = true
      var body = this.listQuery
      getTagList({ body }).then(response => {
        console.log(TAG + " response: " + JSON.stringify(response))
        this.list = response.data.result
        this.count = response.data.totalSize
        this.listLoading = false
      })
    },

    handleSizeChange(pageSize) {
      this.listQuery.pageSize = pageSize
      this.tagList()
    },
    handleCurrentChange(pageNum) {
      this.listQuery.pageNum = pageNum
      this.tagList()
    },
    deleteTag (id) {
      this.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteTagById(id).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          //删除后，重新获取标签列表
          this.tagList()
        }).catch(() => {
          console.log('error')
        })
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '你已经取消删除该标签！'
        })
      })
    },
    openModel(tag) {
      if (tag != null) {
        this.tagForm = JSON.parse(JSON.stringify(tag));
        this.$refs.tagTitle.innerHTML = "修改标签";
      } else {
        this.tagForm.id = null;
        this.tagForm.tagName = "";
        this.$refs.tagTitle.innerHTML = "添加标签";
      }
      this.addOrUpdateDialogVisible = true;
    },
    addOrEditTag() {
      var body = this.tagForm;
      if(body.id == null){
        addTag(body).then(response => {
          this.$message({
            type: 'success',
            message: '添加标签成功!'
          })
          //重新获取标签列表
          this.tagList()
        }).catch(() => {
          console.log('error')
        })
      } else {
        updateTag(body).then(response => {
          this.$message({
            type: 'success',
            message: '修改标签成功!'
          })
          this.tagList()
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
