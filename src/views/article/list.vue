<template>
  <el-card class="box-card">

    <!-- 设置标题文章管理 -->
    <div slot="header" class="clearfix">
      <span>文章列表</span>
    </div>

    <!-- 文章条件查询 -->
    <div style="margin-left: auto">
      <!-- 按照分类查询 -->
      <el-select
        clearable
        size="small"
        v-model="categoryId"
        filterable
        placeholder="请选择分类"
        style="margin-right: 1rem"
      >
        <el-option
          v-for="item in categoryList"
          :key="item.id"
          :label="item.categoryName"
          :value="item.id"
        />
      </el-select>

      <!-- 按照标签查询 -->
      <el-select
        clearable
        size="small"
        v-model="tagId"
        filterable
        placeholder="请选择标签"
        style="margin-right: 1rem"
      >
        <el-option
          v-for="item in tagList"
          :key="item.id"
          :label="item.tagName"
          :value="item.id"
        />
      </el-select>

      <!-- 文章类型 -->
      <el-select
        clearable
        v-model="status"
        placeholder="请选择文章类型"
        size="small"
        style="margin-right:1rem"
      >
        <el-option
          v-for="item in statusList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>

      <!-- 文章名 -->
      <el-input
        clearable
        v-model="title"
        prefix-icon="el-icon-search"
        size="small"
        placeholder="请输入文章名"
        style="width:200px"
        @keyup.enter.native="articleList"
      />

      <el-button
        type="primary"
        size="small"
        icon="el-icon-search"
        style="margin-left:1rem"
        @click="articleList"
      >
        搜索
      </el-button>
    </div>
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

      <el-table-column align="center"  label="文章分类">
        <template slot-scope="scope">
          <el-tag type="warning" style="margin: 5px">{{ scope.row.categoryName}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="文章标签">
        <template slot-scope="scope">
          <el-tag style="margin: 5px" type="success" v-for="(tag, index) in scope.row.tagList" :key="index">
            {{ tag.tagName }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="文章内容">
        <template slot-scope="scope">
          <span
            :title="scope.row.content"
            class="content-truncate"
          >
      {{ truncatedContent(scope.row.content) }}
    </span>
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
          <span>
            <el-image
              v-if="scope.row.imageUrl"
              :src="scope.row.imageUrl"
              alt="暂无"
              width="360px"
              height="180px"
            />
            <div v-else> 暂无封面 </div>
          </span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="是否置顶">
        <template slot-scope="scope">
          <el-tag :type="typeTop(scope.row.isTop)">
            {{ mapIs[scope.row.isTop] }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="是否被删除">
        <template slot-scope="scope">
          <el-tag :type="typeDelete(scope.row.isDelete)">
            {{ mapIs[scope.row.isDelete] }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="文章状态">
        <template slot-scope="scope">
          <el-tag :type="typeStatus(scope.row.status)">{{ mapStatus[scope.row.status] }}</el-tag>
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


  </el-card>
</template>
<script>
import { getArticleList, getArticleById, deleteArticleById, updateArticle, addArticle} from "@/api/article";
import ar from "element-ui/src/locale/lang/ar";
import {getCategoryById, getCategoryByName} from "@/api/category";
import {getTagByName} from "@/api/tag";

const TAG = "====sea====> article/list.vue ====> "

export default {
  name: 'ArticleList',

  created() {
    this.articleList();
    this.getCategoryList();
    this.getTagList();
  },

  data(){
    return {
      list: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        title: this.title,
        status: this.status,
        categoryId: this.categoryId,
        tagId: this.tagId
      },
      count: 0,
      listByNameQuery:{
        categoryName: '',
        tagName: ''
      },
      categoryId: null,
      categoryList: null,
      status: null,
      tagId: null,
      tagList: [],
      title: '',
      countView: null,
      totalWords: null,
      description: null,
      statusList: [
        {
          value: 1,
          label: "已发布"
        },
        {
          value: 2,
          label: "加密"
        },
        {
          value: 3,
          label: "草稿"
        }
      ],
      mapIs: {
        0: '否',
        1: '是'
      },
      mapStatus: {
        1: '已发布',
        2: '加密',
        3: '草稿'
      }
    }
  },
  methods: {
    truncatedContent: function(content) {
      return content.length > 50 ? content.slice(0, 50) + '...' : content;
    },

    articleList(){
      this.listLoading = true;
      this.listQuery.title = this.title;
      this.listQuery.categoryId = this.categoryId;
      this.listQuery.tagId = this.tagId;
      this.listQuery.status = this.status;
      let body = this.listQuery;
      console.log(TAG + " listQuery: " + JSON.stringify(body));
      getArticleList({ body }).then(response => {
        console.log(TAG + " response: " + JSON.stringify(response));
        this.list = response.data.result;
        this.count = response.data.totalSize;
        this.listLoading = false;
      })
    },

    handleSizeChange(pageSize) {
      this.listQuery.pageSize = pageSize;
      this.articleList();
    },
    handleCurrentChange(pageNum) {
      this.listQuery.pageNum = pageNum;
      this.articleList();
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
        });
      }).catch(() => {
        console.log(TAG + " 取消删除文章： " + id);
        this.$message({
          type: 'error',
          message: '你已经取消删除该文章！'
        })
      });
    },
    // 获取所有分类列表
    getCategoryList(){
      this.listByNameQuery.categoryName = '';
      let body = this.listByNameQuery;
      console.log(TAG + "body: " + JSON.stringify(body));
      getCategoryByName({ body }).then(response =>{
        console.log(TAG + " response: " + JSON.stringify(response));
        this.categoryList = response.data;
      });
    },

    // 获取所有标签列表
    getTagList(){
      this.listByNameQuery.tagName = '';
      let body = this.listByNameQuery;
      console.log(TAG + "body: " + JSON.stringify(body));
      getTagByName({ body }).then(response =>{
        console.log(TAG + " response: " + JSON.stringify(response));
        this.tagList = response.data;
      });
    },

    typeTop(item) {
      if(item === 0)
        return 'primary';
      if(item === 1)
        return 'danger';
    },
    typeDelete(item) {
      if(item === 0)
        return 'primary';
      if(item === 1)
        return 'danger';
    },
    typeStatus(item){
      if(item === 1)
        return 'success';
      if(item === 2)
        return 'warning';
      if(item === 3)
        return 'danger';
    }

  }

}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.content-truncate {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.content-truncate:hover {
  overflow: visible;
  white-space: normal;
  display: inline-block;
  width: 100%;
}

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
