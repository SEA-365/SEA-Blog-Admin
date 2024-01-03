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

      <el-table-column align="center" label="文章id">
        <template v-slot="scope">
          <span>{{ scope.row.articleId}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="文章作者">
        <template v-slot="scope">
          <span>{{ scope.row.articleAuthor}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="评论创建者id">
        <template v-slot="scope">
          <span>{{ scope.row.commentCreateId}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="被回复者id">
        <template v-slot="scope">
          <span>{{ scope.row.commentRelyId}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="评论创建时间">
        <template v-slot="scope">
          <span>{{ scope.row.commentCreateTime}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="评论内容">
        <template v-slot="scope">
          <span>{{ scope.row.commentContent}}</span>
        </template>
      </el-table-column>


      <el-table-column align="center" label="是否被删除">
        <template v-slot="scope">
          <span>{{ scope.row.isDelete}}</span>
        </template>
      </el-table-column>


      <el-table-column align="center" label="是否通过审核">
        <template v-slot="scope">
          <span>{{ scope.row.isReview}}</span>
        </template>
      </el-table-column>


      <el-table-column align="center" label="操作" width="180">
        <template v-slot="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="openModel(scope.row)" :disabled="true" plain>编辑</el-button>
          <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteComment(scope.row.id)">删除</el-button>
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
      <div class="dialog-title-container" slot="title" ref="commentTitle" />
      <el-form label-width="80px" size="medium" :model="commentForm">
        <el-form-item label="评论id">
          <el-input v-model="commentForm.id" style="width:80%" />
        </el-form-item>

        <el-form-item label="文章id">
          <el-input v-model="commentForm.articleId" style="width:80%" />
        </el-form-item>

        <el-form-item label="文章作者">
          <el-input v-model="commentForm.articleAuthor" style="width:80%" />
        </el-form-item>


        <el-form-item label="评论创建者id">
          <el-input v-model="commentForm.commentCreateId" style="width:80%" />
        </el-form-item>


        <el-form-item label="被评论回复者id">
          <el-input v-model="commentForm.commentRelyId" style="width:80%" />
        </el-form-item>


        <el-form-item label="评论内容">
          <el-input v-model="commentForm.commentContent" style="width:80%" />
        </el-form-item>

        <el-form-item label="是否被删除">
          <el-input v-model="commentForm.isDelete" style="width:80%" />
        </el-form-item>

        <el-form-item label="是否通过审核">
          <el-input v-model="commentForm.isReview" style="width:80%" />
        </el-form-item>

      </el-form>
      <div slot="footer">
        <el-button @click="addOrUpdateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrEditComment">
          确 定
        </el-button>
      </div>
    </el-dialog>

  </el-card>
</template>
<script>
import { getCommentList, getCommentById, deleteCommentById, updateComment, addComment} from "@/api/comment";

const TAG = "====sea====> comment/list.vue ====> "

export default {
  name: 'CommentList',

  created() {
    this.commentList()
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
      commentForm: {
        id: null,
        articleId: null,
        articleAuthor: '',
        commentReplyId: null,
        commentContent: '',
        isDelete: 0,
        isReview: 0
      }
    }
  },
  methods: {
    commentList(){
      this.listLoading = true
      var body = this.listQuery
      getCommentList({ body }).then(response => {
        console.log(TAG + " response: " + JSON.stringify(response))
        this.list = response.data.result
        this.count = response.data.totalSize
        this.listLoading = false
      })
    },

    handleSizeChange(pageSize) {
      this.listQuery.pageSize = pageSize
      this.commentList()
    },
    handleCurrentChange(pageNum) {
      this.listQuery.pageNum = pageNum
      this.commentList()
    },
    deleteComment (id) {
      this.$confirm('此操作将永久删除该评论, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCommentById(id).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          //删除后，重新获取评论列表
          this.commentList()
        }).catch(() => {
          console.log('error')
        })
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '你已经取消删除该评论！'
        })
      })
    },
    openModel(comment) {
      if (comment != null) {
        this.commentForm = JSON.parse(JSON.stringify(comment));
        this.$refs.commentTitle.innerHTML = "修改评论";
      } else {
        this.commentForm.id = null;
        this.commentForm.articleId = null;
        this.commentForm.articleAuthor = '';
        this.commentForm.commentCreateId = null;
        this.commentForm.commentReplyId = null;
        this.commentForm.commentContent = '';
        this.commentForm.isDelete = 0;
        this.commentForm.isReview = 0;
        this.$refs.commentTitle.innerHTML = "添加评论";
      }
      this.addOrUpdateDialogVisible = true;
    },
    addOrEditComment() {
      var body = this.commentForm;
      if(body.id == null){
        addComment(body).then(response => {
          this.$message({
            type: 'success',
            message: '添加评论成功!'
          })
          //重新获取评论列表
          this.commentList()
        }).catch(() => {
          console.log('error')
        })
      } else {
        updateComment(body).then(response => {
          this.$message({
            type: 'success',
            message: '修改评论成功!'
          })
          this.commentList()
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
