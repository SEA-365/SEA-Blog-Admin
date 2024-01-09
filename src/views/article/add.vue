<template>
  <el-card class="box-card1">


    <el-card class="box-card" >
      <div slot="header" class="clearfix">
        <span>发布文章</span>
      </div>

      <!-- 文章标题 -->
      <div class="article-title-container">
        <el-input size="medium"  v-model="article.title" placeholder="输入文章标题"/>
        <el-button type="warning" size="medium" @click="openDialog" style="margin-left:10px">保存草稿</el-button>
        <el-button type="danger" size="medium" @click="openDialog" style="margin-left:10px">发布文章</el-button>
      </div>


      <!-- 文章内容 -->
      <mavon-editor ref="md" v-model="article.content" style="height:calc(100vh - 260px)" placeholder="在此输入文章内容"/>

      <!-- 发布文章弹窗 -->
      <el-dialog :title="`发布文章：《${article.title}》`" :visible.sync="showDialog" width="30%">
        <el-form label-position="left" :model="article" label-width="100px">
          <el-form-item label="文章分类：">
            <!--当前文章分类，当article.categoryName不是空时显示-->
            <el-tag type="success" v-show="article.categoryName" style="margin: 0 1rem 0 0" :closable="true" @close="removeCategory">
              {{ article.categoryName }}
            </el-tag>
            <!--文章分类弹出框，当article.categoryName为空时显示-->
            <el-popover placement="bottom-start" width="460px" trigger="click" v-show="!article.categoryName">
              <div class="popover-title">分类</div>
              <!-- 搜索框 -->
              <el-autocomplete
                style="width:100%"
                v-model="categoryName"
                :fetch-suggestions="findCategory"
                placeholder="请输入分类名搜索，如果自定义分类，输入完成之后直接回车即可！"
                :trigger-on-focus="false"
                @keyup.enter.native="saveCategory"
                @select="handleFindCategory"
              >
                <template v-slot="{ item }">
                  <div>{{ item.categoryName }}</div>
                </template>
              </el-autocomplete>

              <!--分类数据展示-->
              <div class="popover-container">
                <div class="category-item" v-for="item of categoryList" :key="item.id" @click="addCategory(item)">
                  {{ item.categoryName }}
                </div>
              </div>
              <el-button type="success" plain slot="reference" size="small">添加分类</el-button>

            </el-popover>
          </el-form-item>


          <el-form-item label="文章作者：">
            <el-input v-model="this.user.username" style="width:80%" />
          </el-form-item>

          <el-form-item label="文章作者ID：">
            <el-input v-model="this.user.userId" style="width:80%" />
          </el-form-item>
        </el-form>

        <span slot="footer">
           <el-button @click="handleCancel">取 消</el-button>
           <el-button type="primary" @click="handleSubmit">发布</el-button>
        </span>
      </el-dialog>

    </el-card>

  </el-card>


</template>

<script>

import { addArticle, deleteArticleById, updateArticle, getArticleList, getArticleById} from "@/api/article";
import {getInfo, getUserById} from "@/api/user";
import {addCategory, getCategoryByName} from "@/api/category";


const TAG = "====sea====> article/add.vue ====> "

export default {
  name: 'ArticleAdd',
  created() {
    // 在组件创建时获取用户信息
    this.fetchUserInfo();

    // 接收 "编辑文章" 操作传递的信息
    const  articleId = this.$route.params.articleId;
    console.log(TAG + "edit articleId: " + articleId)
    if(articleId){
      getArticleById(articleId).then((result) => {
        console.log(TAG + " 编辑文章操作 传递的data: " + JSON.stringify(result.data));
        this.article = result.data;
        console.log(TAG + " article: " + JSON.stringify(this.article));
      })
    }
  },
  data() {
    return {
      showDialog: false,
      article: {
        id: "",
        userId: '',
        author: '',
        title: '',
        content: '',
        categoryId: '',
        categoryName: '',
        tagList: null,
        description: '',
        imageUrl: '',
        status: 1
      },
      listByNameQuery:{
        categoryName: this.categoryName
      },
      user: {
        username: '',
        userId: ''
        // 其他用户信息...
      },
      categoryName: '',
      categoryList: null,
      tagName: '',
      tagList: null
    }
  },
  methods: {
    async fetchUserInfo() {
      console.log(TAG + " fetchUserInfo() ");
      try {
        const token = this.$store.state.token;
        // 发送请求获取用户信息
        getInfo(token).then(response => {
          const { data } = response;

          this.user.username = data.username;
          this.user.userId = data.id;

          this.article.author = data.username;
          this.article.userId = data.id;
          console.log(TAG + ' getInfo成功！data: ' + JSON.stringify(data))
        }).catch(error => {
          console.log(TAG + ' getInfo出现异常！')
        })
      } catch (error) {
        console.error(TAG + 'Failed to fetch data:', error);
      }
    },
    openDialog() {
      console.log(TAG + " openDialog() ");
      if (
        this.assertNotEmpty(this.article.title, "请填写文章标题") &&
        this.assertNotEmpty(this.article.content, "请填写文章内容")
      ) {
        this.showDialog = true;
      }
    },
    assertNotEmpty(target, msg) {
      console.log(TAG + " assertNotEmpty() ");
      if (!target) {
        this.$message({
          message: msg,
          type: "warning",
        });
        return false;
      }
      return true;
    },
    handleCancel() {
      console.log(TAG + " handleCancel() ");
      this.showDialog = false;
    },
    handleSubmit() {
      console.log(TAG + " handleSubmit() ");
      this.showDialog = true;
      var body = this.article;
      console.log(TAG + "edit or add article: " + JSON.stringify(this.article));
      console.log(TAG + "edit or add articleId: " + this.article.id)
      if(this.article.id){
        updateArticle(body).then((res) => {
          this.$notify({
            title: "提示",
            message: `文章《${this.article.title}》更新成功`,
            type: "success",
          });
          this.$router.push("/article/list");
        });
      }
      else {
        addArticle(body).then((response) => {
          this.$notify({
            title: "提示",
            message: `文章《${this.article.title}》发布成功`,
            type: "success",
          });
          this.$router.push("/article/list");
        })
      }
    },
    removeCategory() {
      console.log(TAG + " removeCategory() ");
      this.article.categoryName = null;
    },
    getCategoryList() {
      console.log(TAG + " getCategoryList() ");
      let categoryName = '';
      getCategoryByName(categoryName).then(response => {
        this.categoryList = response.data;
      })
    },
    findCategory(categoryName, cb) {
      console.log(TAG + " findCategory() ");
      this.listByNameQuery.categoryName = categoryName;
      var body = this.listByNameQuery;
      getCategoryByName( {body} ).then(response => {
        cb(response.data)
      })
    },
    saveCategory() {
      console.log(TAG + " saveCategory() ");
      if(this.categoryName.trim() !== ''){
        this.addCategory({
          categoryName: this.categoryName
        });
        this.categoryName = "";
      }
    },
    addCategory(data){
      console.log(TAG + " addCategory() ");
      this.article.categoryName = data.categoryName;
    },
    handleFindCategory(data){
      console.log(TAG + " handleFindCategory() ");
      this.addCategory({
        categoryName: data.categoryName
      });
    },
  },
  computed: {
    // 计算属性，用于映射 articleStatus 的值
    mappedArticleStatus: {
      get() {
        // 当 articleStatus 为 0 时，开关显示为 true；为 1 时，开关显示为 false
        return this.article.status === 0;
      },
      set(value) {
        // 当开关状态改变时，将 true 映射为 0，将 false 映射为 1
        this.article.status = value ? 0 : 1;
      },

    },
  }

}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 70%;
  float: left;
  margin: 2% 6%;
}
.box-card1 {
  width: 98%;
  height: 90vh;
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
.article-title-container {
  display: flex;
  align-items: center;
  margin-bottom: 1.25rem;
  margin-top: 1.25rem;
}
.popover-title {
  margin-bottom: 1rem;
  text-align: center;
}
.category-item {
  cursor: pointer;
  padding: 0.6rem 0.5rem;
}
.category-item:hover {
  background-color: #f0f9eb;
  color: #67c23a;
}
.popover-container {
  margin-top: 1rem;
  height: 260px;
  overflow-y: auto;
}

</style>
