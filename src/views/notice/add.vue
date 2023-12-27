<template>
  <el-card class="box-card1">


    <el-card class="box-card" >
      <div slot="header" class="clearfix">
        <span>发布公告</span>
      </div>

      <!-- 公告标题 -->
      <div class="notice-title-container">
        <el-input size="medium"  v-model="notice.noticeTitle" placeholder="输入公告标题"/>
        <el-button type="danger" size="medium" @click="openDialog" style="margin-left:10px">发布公告</el-button>
      </div>


      <!-- 公告内容 -->
      <mavon-editor ref="md" v-model="notice.noticeContent" style="height:calc(100vh - 260px)" placeholder="在此输入公告内容"/>

      <!-- 发布公告弹窗 -->
      <el-dialog :title="`发布公告`" :visible.sync="showDialog" width="30%">
        <el-form label-position="left" label-width="80px">
          <el-form-item label="创建者">
            <el-input v-model="notice.noticeTitle" style="width:80%" />
          </el-form-item>
          <el-form-item label="公告类型">
            <el-select v-model="notice.noticeType" placeholder="请选择公告类型">
              <el-option label="公告" :value="0"></el-option>
              <el-option label="通知" :value="1"></el-option>
              <el-option label="提醒" :value="2"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="公告状态">
            <el-switch v-model="mappedNoticeStatus"></el-switch>
          </el-form-item>

          <el-form-item label="创建者">
            <el-input v-model="user.username" style="width:80%" />
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

import { addNotice } from "@/api/notice";
import axios from "axios";
import {getInfo} from "@/api/user";

export default {
  name: 'NoticeAdd',
  created() {
    // 在组件创建时获取用户信息
    this.fetchUserInfo();
  },
  data() {
    return {
      showDialog: false,
      notice: {
        noticeTitle: '',
        noticeContent: '',
        noticeType: 0,
        noticeStatus: 0,
        creator: ''
      },
      user: {
        // 假设用户信息保存在这里
        username: '当前登录用户名',
        // 其他用户信息...
      },
    }
  },
  methods: {
    async fetchUserInfo() {
      try {
        const token = this.$store.state.token;
        // 发送请求获取用户信息
        getInfo(token).then(response => {
          const { data } = response

          this.user.username = data.username;
          this.notice.creator = data.username;
          console.log(' getInfo成功！')
        }).catch(error => {
          console.log(' getInfo出现异常！')
        })
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    },
    openDialog() {
      if (
        this.assertNotEmpty(this.notice.noticeTitle, "请填写公告标题") &&
        this.assertNotEmpty(this.notice.noticeContent, "请填写公告内容")
      ) {
        this.showDialog = true;
      }
    },
    assertNotEmpty(target, msg) {
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
      this.showDialog = false;
    },
    handleSubmit() {
      this.showDialog = true;
      var body = this.notice;
      addNotice(body).then((response) => {
        this.$notify({
          title: "提示",
          message: `公告《${this.notice.noticeTitle}》发布成功`,
          type: "success",
        });
        this.$router.push("/notice/list");
      })
    },
    creatorUsername() {
      return this.user.username; // 计算属性返回当前登录用户的用户名
    },

  },
  computed: {
    // 计算属性，用于映射 noticeStatus 的值
    mappedNoticeStatus: {
      get() {
        // 当 noticeStatus 为 0 时，开关显示为 true；为 1 时，开关显示为 false
        return this.notice.noticeStatus === 0;
      },
      set(value) {
        // 当开关状态改变时，将 true 映射为 0，将 false 映射为 1
        this.notice.noticeStatus = value ? 0 : 1;
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
.notice-title-container {
  display: flex;
  align-items: center;
  margin-bottom: 1.25rem;
  margin-top: 1.25rem;
}
</style>
