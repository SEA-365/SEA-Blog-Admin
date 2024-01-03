<template>
  <el-card class="box-card">

    <el-table v-loading="listLoading" :data="list" fit highlight-current-row style="width: 98%; margin-top:30px;">
      <el-table-column align="center" label="ID" >
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="文章作者id">
        <template slot-scope="scope">
          <span>{{ scope.row.userId}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="文章作者">
        <template slot-scope="scope">
          <span>{{ scope.row.author}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="文章分类">
        <template slot-scope="scope">
          <span>{{ scope.row.categoryName}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="文章内容">
        <template slot-scope="scope">
          <span>{{ scope.row.content}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="浏览量">
        <template slot-scope="scope">
          <span>{{ scope.row.countViews}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="总字数">
        <template slot-scope="scope">
          <span>{{ scope.row.totalWords}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="点赞数">
        <template slot-scope="scope">
          <span>{{ scope.row.likes}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="文章标题">
        <template slot-scope="scope">
          <span>{{ scope.row.title}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="文章描述">
        <template slot-scope="scope">
          <span>{{ scope.row.description}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="文章封面">
        <template slot-scope="scope">
          <span>{{ scope.row.imageUrl}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="是否置顶">
        <template slot-scope="scope">
          <span>{{ scope.row.isTop}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="是否被删除">
        <template slot-scope="scope">
          <span>{{ scope.row.isDelete}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="文章状态">
        <template slot-scope="scope">
          <span>{{ scope.row.status}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="文章访问密码">
        <template slot-scope="scope">
          <span>{{ scope.row.password}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="修改时间">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime}}</span>
        </template>
      </el-table-column>


      <el-table-column align="center" label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="$router.push({ name: 'ArticleAdd', params: { articleId: scope.row.id }})" plain>编辑</el-button>
          <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteArticle(scope.row.id)">删除</el-button>
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
<!--    <el-dialog :visible.sync="addOrUpdateDialogVisible" width="30%">-->
<!--      <div class="dialog-title-container" slot="title" ref="articleTitle" />-->
<!--      <el-form label-width="80px" size="medium" :model="articleForm">-->
<!--        <el-form-item label="文章id">-->
<!--          <el-input v-model="articleForm.id" style="width:80%" />-->
<!--        </el-form-item>-->

<!--        <el-form-item label="文章作者">-->
<!--          <el-input v-model="articleForm.author" style="width:80%" />-->
<!--        </el-form-item>-->

<!--        <el-form-item label="文章标题">-->
<!--          <el-input v-model="articleForm.title" style="width:80%" />-->
<!--        </el-form-item>-->

<!--        <el-form-item label="文章内容">-->
<!--          <el-input v-model="articleForm.content" style="width:80%" />-->
<!--        </el-form-item>-->

<!--      </el-form>-->
<!--      <div slot="footer">-->
<!--        <el-button @click="addOrUpdateDialogVisible = false">取 消</el-button>-->
<!--        <el-button type="primary" @click="addOrEditArticle">-->
<!--          确 定-->
<!--        </el-button>-->
<!--      </div>-->
<!--    </el-dialog>-->

  </el-card>
</template>
<script>
import { getArticleList, getArticleById, deleteArticleById, updateArticle, addArticle} from "@/api/article";
import ar from "element-ui/src/locale/lang/ar";

const TAG = "====sea====> article/list.vue ====> "

export default {
  name: 'ArticleList',

  created() {
    this.articleList()
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
      articleForm: {
        id: null,
        author: '',
        title: '',
        content: '',
      }
    }
  },
  methods: {
    articleList(){
      this.listLoading = true
      var body = this.listQuery
      getArticleList({ body }).then(response => {
        console.log(TAG + " response: " + JSON.stringify(response))
        this.list = response.data.result
        this.count = response.data.totalSize
        this.listLoading = false
      })
    },

    handleSizeChange(pageSize) {
      this.listQuery.pageSize = pageSize
      this.articleList()
    },
    handleCurrentChange(pageNum) {
      this.listQuery.pageNum = pageNum
      this.articleList()
    },
    deleteArticle (id) {// 逻辑删除文章
      this.$confirm('此操作将永久删除该文章, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        let article = null;
        getArticleById(id).then((result) => {
          console.log(TAG + " result: " + JSON.stringify(result))
          article = result.data;
          if(article.isDelete === 1){
            console.log(TAG + "该文章已删除！")
            this.$message({
              type: 'warning',
              message: '该文章已删除，不能重复删除！'
            })
          }
          else{
            console.log(TAG + " 删除文章： " + id);
            deleteArticleById(id).then(response => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              //删除后，重新获取文章列表
              this.articleList()
            }).catch(() => {
              console.log('error')
            })
          }
        })
      }).catch(() => {
        console.log(TAG + " 取消删除文章： " + id);
        this.$message({
          type: 'error',
          message: '你已经取消删除该文章！'
        })
      })
    },
    openModel(article) {
      if (article != null) {
        this.articleForm = JSON.parse(JSON.stringify(article));
        this.$refs.articleTitle.innerHTML = "修改文章";
      } else {
        this.articleForm.id = null;
        this.articleForm.author = '';
        this.articleForm.title = '';
        this.articleForm.content = '';
        this.$refs.articleTitle.innerHTML = "添加文章";
      }
      this.addOrUpdateDialogVisible = true;
    },
    addOrEditArticle() {
      var body = this.articleForm;
      if(body.id == null){
        addArticle(body).then(response => {
          this.$message({
            type: 'success',
            message: '添加文章成功!'
          })
          //重新获取文章列表
          this.articleList()
        }).catch(() => {
          console.log('error')
        })
      } else {
        updateArticle(body).then(response => {
          this.$message({
            type: 'success',
            message: '修改文章成功!'
          })
          this.articleList()
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
