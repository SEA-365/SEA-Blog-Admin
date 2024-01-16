<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-people">
<!--          <svg-icon icon-class="peoples" class-name="card-panel-icon" />-->
<!--          <img :src="dashboard_article" class="card-panel-icon"  alt="文章图标"/>-->
          <el-image :src = "'/img/dashboard_article.svg'" class="card-panel-icon" style="width: auto"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            文章数量
          </div>
          <count-to :start-val="0" :end-val="102400" :duration="2600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-message">
<!--          <svg-icon icon-class="message" class-name="card-panel-icon" />-->
          <el-image :src = "'/img/dashboard_category.svg'" class="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            分类数量
          </div>
          <count-to :start-val="0" :end-val="81212" :duration="3000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-money">
<!--          <svg-icon icon-class="money" class-name="card-panel-icon" />-->
          <el-image :src = "'/img/dashboard_tag.svg'" class="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            标签数量
          </div>
          <count-to :start-val="0" :end-val="9280" :duration="3200" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-shopping">
<!--          <svg-icon icon-class="shopping" class-name="card-panel-icon" />-->
          <el-image :src = "'/img/dashboard_user.svg'" class="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            用户数量
          </div>
          <count-to :start-val="0" :end-val="13600" :duration="3600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import dashboard from "@/views/dashboard/index.vue";


export default {
  computed: {
    dashboard() {
      return dashboard
    }
  },
  components: {
    CountTo
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #687f8b;
      }

      .icon-message {
        background: #964d76;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    //.icon-people {
    //  color: #40c9c6;
    //}
    //
    //.icon-message {
    //  color: #36a3f7;
    //}
    //
    //.icon-money {
    //  color: #f4516c;
    //}
    //
    //.icon-shopping {
    //  color: #34bfa3
    //}

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
      width: 50px;
      height: 50px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 24px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>

