<template>
  <div class="full-page">
    <div class="register-container">
      <el-form ref="registerForm" :model="registerForm" :rules="registerRules" class="register-form" auto-complete="on" label-position="left">

        <div class="title-container">
          <h3 class="title">欢迎注册 SEA-Blog Admin</h3>
        </div>

        <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>

          <el-input
            v-model="registerForm.username"
            placeholder="账号"
            name="username"
            type="text"
            tabindex="1"
            auto-complete="on"
          />
        </el-form-item>

        <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
          <el-input
            :key="passwordType"
            v-model="registerForm.password"
            :type="passwordType"
            placeholder="密码"
            name="password"
            tabindex="2"
            auto-complete="on"
          />
          <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
        </el-form-item>

        <el-form-item prop="confirmPassword">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
          <el-input
            :key="passwordType"
            v-model="registerForm.confirmPassword"
            :type="passwordType"
            placeholder="再次输入密码"
            name="confirmPassword"
            tabindex="3"
            auto-complete="on"
          />
          <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
        </el-form-item>

        <el-form-item prop="email">
        <span class="svg-container">
          <svg-icon icon-class="email" />
        </span>

          <el-input
            v-model="registerForm.email"
            placeholder="邮箱"
            name="email"
            type="text"
            tabindex="4"
            auto-complete="on"
          />
        </el-form-item>


        <el-form-item prop="phone">
        <span class="svg-container">
          <svg-icon icon-class="phone" />
        </span>

          <el-input
            v-model="registerForm.phone"
            placeholder="手机号码"
            name="phone"
            type="text"
            tabindex="5"
            auto-complete="on"
          />
        </el-form-item>


        <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px; font-weight: bolder; font-size: 18px" @click.native.prevent="handleRegister">Register</el-button>
        <!--
              <div class="tips">
                <span style="margin-right:20px;">username: admin</span>
                <span> password: any</span>
              </div>
        -->

      </el-form>

    </div>

    <footer class="footer" style="text-align: center;">

      <div class="footer-item">
        <a target="_blank" rel="noopener noreferrer">
          <span class="item-text">Contact me: SEA-365 (WeChat ID)</span>
        </a>
      </div>

      <br/>

      <div class="copy-right"><span class="name"> Copyright © 2024  SEA-Blog &nbsp; |  &nbsp;  </span>
        <a target="_blank" rel="noreferrer" href="https://beian.miit.gov.cn/">京ICP备2024050938号</a>
      </div>

    </footer>
  </div>


</template>

<script>
import { validUsername } from '@/utils/validate'

export default {
  name: 'Register',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    const validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.registerForm.password) {
        callback(new Error('The password entered twice is inconsistent'));
      } else {
        callback()
      }
    }

    const validateEmail = (rule, value, callback) => {
      // 邮箱正则表达式
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (!value) {
        // 如果值为空，通过 callback 不传入参数表示验证通过
        callback();
      } else if (!emailRegex.test(value)) {
        // 如果值非空但不符合邮箱格式，通过 callback 传入错误信息
        callback(new Error('Invalid email format'));
      } else {
        // 值非空且符合邮箱格式，通过 callback 不传入参数表示验证通过
        callback();
      }
    }

    const validatePhone = (rule, value, callback) => {
      // 手机号正则表达式，支持中国大陆手机号（11位数字，以1开头）
      const phoneRegex = /^1[0-9]{10}$/;

      if (!value) {
        // 如果值为空，通过 callback 不传入参数表示验证通过
        callback();
      } else if (!phoneRegex.test(value)) {
        // 如果值非空但不符合手机号格式，通过 callback 传入错误信息
        callback(new Error('Invalid phone number format'));
      } else {
        // 值非空且符合手机号格式，通过 callback 不传入参数表示验证通过
        callback();
      }
    }

    return {
      registerForm: {
        /*
          username: 'admin',
          password: '111111'
        */
        username: undefined,
        password: undefined,
        email: undefined,
        phone: undefined,
      },
      confirmPassword: '', // 用于确认密码的字段
      registerRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        confirmPassword: [{ required: true, trigger: 'blur', validator: validateConfirmPassword }],
        email: [{ required: true, trigger: 'blur', validator: validateEmail }],
        phone: [{ required: true, trigger: 'blur', validator: validatePhone }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    },
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => { // 在下一次DOM更新之后执行回调
        this.$refs.password.focus()
      })
    },
    handleRegister() {
      const TAG = '=====sea=====>handleRegister()====>'
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          console.log(TAG + 'validate()')
          this.loading = true
          this.$store.dispatch('user/register', this.registerForm).then(() => {
            // 保存用户信息到本地存储
            console.log(TAG + 'username: ' + this.registerForm.username)
            console.log(TAG + 'this.$store.state.user：' + JSON.stringify(this.$store.state.user))
            // 重定向到指定地址或默认地址
            this.$router.push('/login')
            this.loading = false
          }).catch(error => {
            // 登录失败逻辑
            console.error(TAG + 'register failed:', error.message)
            this.$notify.error({
              title: '登录失败！',
              message: error.message || '未知错误，请重试。'
            })
          }).finally(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .register-container .el-input input {
    color: $cursor;
  }
}

.register-link {
  color: rgba(255,255,255);
  text-align: right; /* 将内容右对齐 */
  margin: 10px; /* 添加顶部间距 */
}

.register-link a {
  color: rgba(0,164,255);
  margin-left: 2px; /* 设置超链接之间的间距 */
}

/* reset element-ui css */
.register-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray: #a5b4bd;
$light_gray:#eee;

.full-page {
  min-height: 100vh; /* 最小高度占满视口 */
  display: flex;
  flex-direction: column;
}

.register-container {
  flex: 1; /* 让登录容器自动填充剩余空间 */
  padding: 160px 35px 0;
  box-sizing: border-box;
  background-color: $bg;
  overflow: hidden;
  background-image: url('../../icons/img/bg.jpg'); /* 设置背景图片 */
  background-size: cover; /* 图片大小覆盖整个容器 */
  background-position: center; /* 图片居中显示 */

  .register-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;

    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 46px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}

.footer {
  left: 0;
  right: 0;
  width: 100%;
  background-color: #283443;
  color: #fff;
  padding: 20px;
  overflow-y: auto; /* 允许垂直滚动 */
  box-sizing: border-box; /* 包含 padding 在内的盒子模型 */
}

</style>
