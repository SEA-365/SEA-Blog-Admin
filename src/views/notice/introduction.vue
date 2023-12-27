<template>
  <el-card class="box-card1">


    <el-card class="box-card" >
      <div slot="header" class="clearfix">
        <span>通知公告管理</span>
      </div>
      <div class="text item">
        更多功能开发中...
      </div>
    </el-card>

  </el-card>
</template>

<script>


export default {
  name: 'NoticeIntroduction',

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
</style>
