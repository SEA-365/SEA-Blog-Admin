<template>
  <el-card class="box-card1">


    <el-card class="box-card" >
      <div slot="header" class="clearfix">
        <span>发布文章</span>
      </div>

      <!-- 文章标题 -->
      <div class="article-title-container">
        <el-input size="medium"  v-model="article.title" placeholder="输入文章标题"/>
        <el-button type="warning" size="medium" @click="saveDraft" style="margin-left:10px">保存草稿</el-button>
        <el-button type="danger" size="medium" @click="openDialog" style="margin-left:10px">发布文章</el-button>
      </div>


      <!-- 文章内容 -->
      <mavon-editor ref="md" v-model="article.content" style="height:calc(100vh - 260px)" placeholder="在此输入文章内容"/>

      <!-- 发布文章弹窗 -->
      <el-dialog :title="`发布文章：《${article.title}》`" :visible.sync="showDialog" width="30%">
        <el-form label-position="left" :model="article" label-width="100px">

          <el-form-item label="上传文章封面">
            <!--上传组件：使用http-request自定义上传方式覆盖默认上传方式-->
            <el-upload
              class="upload-img"
              drag
              action=""
              :http-request="uploadImgFile"
              multiple
              :before-upload="handleUploadBefore">
              <i class="el-icon-upload" v-if="article.imageUrl === ''"></i>
              <div class="el-upload__text" v-if="article.imageUrl === ''">将文件拖到此处，或<em>点击上传</em></div>

              <!-- 否则，显示文章中定义的图片 -->
              <el-image
                v-else
                :src="article.imageUrl"
                alt="文章图片描述"
                width="360px"
                height="180px"
              />
            </el-upload>
          </el-form-item>

          <!--添加文章分类-->
          <el-form-item label="文章分类：">
            <!--当前文章分类，当article.categoryName不是空时显示-->
            <el-tag type="warning" v-show="article.categoryName" style="margin: 0 1rem 0 0" :closable="true" @close="removeCategory">
              {{ article.categoryName }}
            </el-tag>
            <!--文章分类弹出框，当article.categoryName为空时显示-->
            <el-popover placement="bottom-start" width="460px" trigger="click" v-show="!article.categoryName">
              <div class="popover-title">分类</div>
              <!-- 搜索框 -->
              <!--  :fetch-suggestions="findCategory"  ==> findCategory函数将在用户输入时触发  -->
              <!--  @keyup.enter.native="saveCategory"  ==> saveCategory函数将在用户按下回车键时触发  -->
              <!--  @select="handleFindCategory"  ==> handleFindCategory函数将在用户选择一个建议项时触发  -->
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
                <div class="category-item" v-for="item of categoryList" :key="item.id" @click.native="addCategory(item)">
                  {{ item.categoryName }}
                </div>
              </div>
              <el-button type="success" plain slot="reference" size="small">添加分类</el-button>

            </el-popover>
          </el-form-item>

          <!--添加文章标签-->
          <el-form-item label="文章标签：">
            <!--当前文章标签，当tagList不是空时显示-->
            <el-tag type="success" v-show="article.tagList" v-for="(tag, index) in article.tagList" :key="index" style="margin: 0 1rem 0 0" :closable="true" @close="removeTag(tag)">
              {{ tag.tagName }}
            </el-tag>

            <!--标签选择或新增，每篇文章不超过5个标签-->
            <el-popover placement="bottom-start" width="460px" trigger="click">
              <div class="popover-title">标签</div>
              <!-- 搜索框 -->
              <!--  :fetch-suggestions="findTag"  ==> findTag函数将在用户输入时触发  -->
              <!--  @keyup.enter.native="saveTag"  ==> saveTag函数将在用户按下回车键时触发  -->
              <!--  @select="handleFindTag"  ==> handleFindTag函数将在用户选择一个建议项时触发  -->
              <el-autocomplete
                style="width:100%"
                v-model="tagName"
                :fetch-suggestions="findTag"
                placeholder="请输入标签名搜索，如果自定义标签，输入完成之后直接回车即可！"
                :trigger-on-focus="false"
                @keyup.enter.native="saveTag"
                @select="handleFindTag"
              >
                <template v-slot="{ item }">
                  <div>{{ item.tagName }}</div>
                </template>
              </el-autocomplete>

              <!--分类数据展示-->
              <div class="popover-container">
                <div style="margin-bottom: 1rem">添加标签</div>
                <el-tag style="margin: 3px" v-for="(item, index) of tagList" :key="index" :class="tagClass(item)" @click.native="addTag(item)">
                  {{ item.tagName }}
                </el-tag>
              </div>
              <el-button type="primary" plain slot="reference">添加标签</el-button>

            </el-popover>
          </el-form-item>

          <el-form-item label="文章摘要">
            <el-input type="textarea" :row="2" placeholder="请输入文章摘要" v-model="article.description" style="width: 220px"/>
          </el-form-item>

          <el-form-item label="文章作者：">
            <el-input v-model="this.user.username" style="width:80%" />
          </el-form-item>

          <el-form-item label="文章作者ID：">
            <el-input v-model="this.user.userId" style="width:80%" />
          </el-form-item>

          <el-form-item label="发布形式">
            <el-radio-group v-model="article.status">
              <el-radio :label="1" @change="handleRadioChange">全部可见</el-radio>
              <el-radio :label="2" @change="handleRadioChange">加密文章</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="文章密码" v-if="showPasswordInput">
            <el-input v-model="article.password" type="password" style="width:80%"></el-input>
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

import {addArticle, deleteArticleById, updateArticle, getArticleList, getArticleById, uploadImg} from "@/api/article";
import {getInfo, getUserById} from "@/api/user";
import {addCategory, getCategoryByName} from "@/api/category";
import {getTagByName} from "@/api/tag";
import upload from "element-ui/packages/upload";


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
        this.tagList = result.data.tagList;
        console.log(TAG + " article: " + JSON.stringify(this.article));
      })
    }
  },
  data() {
    return {
      showDialog: false, // 发布文章痰弹窗显示
      showPasswordInput: false, // 文章密码输入框显示
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
        status: 1,
        password: '',
      },
      listByNameQuery:{
        categoryName: this.categoryName,
        tagName: this.tagName
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
    // 获取当前登录用户的信息
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

    // 点击发布文章按钮，打开弹窗
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

    // 点击取消按钮处理逻辑
    handleCancel() {
      console.log(TAG + " handleCancel() ");
      this.showDialog = false;
    },

    // 点击发布按钮处理逻辑
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

    // 移除当前文章分类
    removeCategory() {
      console.log(TAG + " removeCategory() ");
      this.article.categoryName = null;
    },

    // 获取分类列表
    getCategoryList() {
      console.log(TAG + " getCategoryList() ");
      this.listByNameQuery.categoryName = '';
      var body = this.listByNameQuery;
      getCategoryByName({ body }).then(response => {
        console.log(TAG + " response: " + JSON.stringify(response.data))
        this.categoryList = response.data;
      })
    },

    // 模糊搜索分类
    findCategory(categoryName, cb) {
      console.log(TAG + " findCategory() ");
      this.listByNameQuery.categoryName = categoryName;
      var body = this.listByNameQuery;
      getCategoryByName( {body} ).then(response => {
        cb(response.data)
      })
    },

    // 保存输入的分类
    saveCategory() {
      console.log(TAG + " saveCategory() ");
      if(this.categoryName.trim() !== ''){
        this.addCategory({
          categoryName: this.categoryName
        });
        this.categoryName = "";
      }
    },

    // 新增分类
    addCategory(data){
      console.log(TAG + " addCategory() ");
      this.article.categoryName = data.categoryName;
    },

    // 选取建议项分类的处理逻辑
    handleFindCategory(data){
      console.log(TAG + " handleFindCategory() ");
      this.addCategory({
        categoryName: data.categoryName
      });
    },

    // 获取标签列表
    getTagList(){
      console.log(TAG + " getTagList() ");
      this.listByNameQuery.tagName = '';
      var body = this.listByNameQuery;
      getTagByName({ body }).then(response => {
        console.log(TAG + " response: " + JSON.stringify(response.data))
        this.tagList = response.data;
      })
    },

    // 模糊搜索标签
    findTag(tagName, cb) {
      console.log(TAG + " findTag() ");
      this.listByNameQuery.tagName = tagName;
      var body = this.listByNameQuery;
      getTagByName( {body} ).then(response => {
        cb(response.data)
      })
    },

    handleFindTag(data) {
      this.addTag({
        tagName: data.tagName
      });
    },

    // 保存输入的标签
    saveTag() {
      console.log(TAG + " saveTag() ");
      if(this.tagName.trim() !== ''){
        this.addTag({
          tagName: this.tagName
        });
        this.tagName = "";
      }
    },

    // 新增标签
    addTag(data){
      console.log(TAG + " addTag() ");
      if (!this.article.tagList || this.article.tagList.indexOf(data) === -1) {
        console.log(TAG + " addTag() " + data.tagName);
        if(!this.article.tagList){
          this.article.tagList = [];
        }
        this.article.tagList.push(data);
        console.log(TAG + " addTag() " + JSON.stringify(this.article.tagList));
      }
    },

    removeTag(item) {
      const index = this.article.tagList.indexOf(item);
      this.article.tagList.splice(index, 1);
    },

    // 文件上传前进行大小和格式检查
    handleUploadBefore(file){
      const isJPGOrPNG = file.type === "image/jpeg" || file.type === "image/png";
      const isFileSizeExceed = file.size / 1024 / 1024 < 10;
      if(!isJPGOrPNG){
        this.$message.error('请上传JPG格式或PNG格式的图片！');
      }
      if(!isFileSizeExceed){
        this.$message.error('上传的图片大小不能超过10MB！');
      }
      return isFileSizeExceed && isJPGOrPNG;
    },

    // 自定义图片上传请求，覆盖原来的上传方式
    uploadImgFile(param) {
      let fd = new FormData();
      fd.append("file", param.file);
      uploadImg(fd).then(response => {
        console.log(TAG + " url: " + JSON.stringify(response));
        if(response.data && response.data.statusCode === 20000){
          this.$message({
            type: 'success',
            message: '图片上传成功!'
          })
        }
        this.article.imageUrl = response.data;
      })
    },

    // 保存草稿
    saveDraft() {
      this.article.status = 3;
      if (
        this.assertNotEmpty(this.article.title, "请填写文章标题") &&
        this.assertNotEmpty(this.article.content, "请填写文章内容")
      ) {

        let body = this.article;
        console.log(TAG + "saveDraft() article: " + JSON.stringify(this.article));
        console.log(TAG + "saveDraft() articleId: " + this.article.id)
        if(this.article.id){
          updateArticle(body).then((response) => {
            if(response.statusCode === 20000){
              this.$message({
                type: "success",
                message: "保存草稿成功！"
              })
            }
            else{
              this.$message({
                type: "error",
                message: "保存草稿失败！"
              })
            }
          });
        }
        else {
          addArticle(body).then((response) => {
            if(response.statusCode === 20000){
              this.$message({
                type: "success",
                message: "保存草稿成功！"
              })
            }
            else{
              this.$message({
                type: "error",
                message: "保存草稿失败！"
              })
            }
            this.$router.push("/article/list");
          })
        }
      }
      return false;
    },

    // 文章密码输入框显示
    handleRadioChange(){
      this.showPasswordInput = this.article.status === 2;
    }

  },
  computed: {
    upload() {
      return upload
    },
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
    tagClass() {
      return function(item) {
        const index = this.article.tagList.indexOf(item.tagName);
        return index !== -1 ? "tag-item-select" : "tag-item";
      };
    }
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
