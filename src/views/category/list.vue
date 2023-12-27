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

      <el-table-column align="center" label="分类名称">
        <template slot-scope="scope">
          <span>{{ scope.row.categoryName}}</span>
        </template>
      </el-table-column>


      <el-table-column align="center" label="分类创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="分类修改时间">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime}}</span>
        </template>
      </el-table-column>


      <el-table-column align="center" label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="openModel(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteCategory(scope.row.id)">删除</el-button>
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
      <div class="dialog-title-container" slot="title" ref="categoryTitle" />
      <el-form label-width="80px" size="medium" :model="categoryForm">
        <el-form-item label="分类id">
          <el-input v-model="categoryForm.id" style="width:80%" />
        </el-form-item>

        <el-form-item label="分类名称">
          <el-input v-model="categoryForm.categoryName" style="width:80%" />
        </el-form-item>


      </el-form>
      <div slot="footer">
        <el-button @click="addOrUpdateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrEditCategory">
          确 定
        </el-button>
      </div>
    </el-dialog>

  </el-card>
</template>
<script>
import { getCategoryList, getCategoryById, deleteCategoryById, updateCategory, addCategory} from "@/api/category";

const TAG = "====sea====> category/list.vue ====> "

export default {
  name: 'CategoryList',

  created() {
    this.categoryList()
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
      categoryForm: {
        id: null,
        categoryName: '',
      }
    }
  },
  methods: {
    categoryList(){
      this.listLoading = true
      var body = this.listQuery
      getCategoryList({ body }).then(response => {
        console.log(TAG + " response: " + JSON.stringify(response))
        this.list = response.data.result
        this.count = response.data.totalSize
        this.listLoading = false
      })
    },

    handleSizeChange(pageSize) {
      this.listQuery.pageSize = pageSize
      this.categoryList()
    },
    handleCurrentChange(pageNum) {
      this.listQuery.pageNum = pageNum
      this.categoryList()
    },
    deleteCategory (id) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCategoryById(id).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          //删除后，重新获取分类列表
          this.categoryList()
        }).catch(() => {
          console.log('error')
        })
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '你已经取消删除该分类！'
        })
      })
    },
    openModel(category) {
      if (category != null) {
        this.categoryForm = JSON.parse(JSON.stringify(category));
        this.$refs.categoryTitle.innerHTML = "修改分类";
      } else {
        this.categoryForm.id = null;
        this.categoryForm.categoryName = "";
        this.$refs.categoryTitle.innerHTML = "添加分类";
      }
      this.addOrUpdateDialogVisible = true;
    },
    addOrEditCategory() {
      var body = this.categoryForm;
      if(body.id == null){
        addCategory(body).then(response => {
          this.$message({
            type: 'success',
            message: '添加分类成功!'
          })
          //重新获取分类列表
          this.categoryList()
        }).catch(() => {
          console.log('error')
        })
      } else {
        updateCategory(body).then(response => {
          this.$message({
            type: 'success',
            message: '修改分类成功!'
          })
          this.categoryList()
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
