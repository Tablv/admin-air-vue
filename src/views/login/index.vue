<template>
  <section class="login-container">
    <el-row
      tag="header"
      class="login-header"
      type="flex"
      justify="space-between"
      align="middle"
    >
      <el-row
        tag="section"
        class="logo"
        type="flex"
        align="middle"
      >
        <img
          src="@/assets/fd.png"
          alt="GlawayLogo"
          height="48px"
        >
        <span class="title">Glaway-Admin</span>
        <span class="version">v1.0.0</span>
      </el-row>
    </el-row>

    <el-row
      tag="main"
      class="login-main"
      type="flex"
      justify="center"
      align="middle"
    >
      <el-card class="login-form-container">
        <el-form
          ref="loginForm"
          size="small"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          auto-complete="on"
          label-position="left"
          :show-message="false"
          :status-icon="true"
        >
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入用户名"
              prefix-icon="fa fa-user"
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              ref="password"
              :key="passwordType"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="请输入密码"
              prefix-icon="fa fa-key"
              @keyup.enter.native="handleLogin"
            >
              <el-button
                slot="append"
                class="show-pwd"
                :icon="passwordType === 'password' ? 'fa fa-eye' : 'fa fa-eye-slash'"
                @click="showPwd"
              />
            </el-input>
          </el-form-item>

          <el-button
            :loading="loading"
            type="primary"
            class="login-button"
            round
            size="large"
            icon="fa fa-angle-right"
            @click.native.prevent="handleLogin"
          >
            <span>登录</span>
          </el-button>
        </el-form>
      </el-card>
    </el-row>
  </section>
</template>

<script>
import { validUsername } from '@/utils/validate'
const validateUsername = (rule, value, callback) => {
  if (!validUsername(value)) {
    callback(new Error('请输入用户名'))
  } else {
    callback()
  }
}
const validatePassword = (rule, value, callback) => {
  if (value.length < 6) {
    callback(new Error('请输入正确的密码'))
  } else {
    callback()
  }
}
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password'
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            // 登录成功
            this.$router.push({ path: '/index' })
          }).catch(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
$dark_gray:#889aa4;
$light_gray:#eee;
$cursor: #000;

// @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
//   .login-container .el-input input {
//     color: $cursor;
//   }
// }

/* reset element-ui css */
.login-container {
  background: url("../../assets/login-bg.jpg") center no-repeat;
  background-size: cover;
  width: 100%;
  height: 100%;
  min-height: 600px;
  overflow: hidden;

  .login-header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 80px;
    padding: 0 20px;
    background-color: #f6f7fb;
    z-index: 99;

    .logo {
      > span {
        margin-left: 10px;
      }

      .title {
        font-size: 24px;
      }

      .version {
        font-size: 14px;
      }
    }
  }

  .login-main {
    z-index: 1;
    height: 100%;

    .login-form-container {
      margin-top: 40px;
      width: 500px;
      overflow: hidden;
      border-radius: 16px;
    }
    
    // .login-form-title {
    //   font-size: 26px;
    //   color: $dark_gray;
    //   margin: 0px auto 40px;
    //   text-align: center;
    //   font-weight: bold;
    // }
    
    .login-form {
      position: relative;
      margin: 0 auto;
      padding: 24px 60px 20px;
      color: $dark_gray;

      .el-form-item {
        border-radius: 20px;
        overflow: hidden;

        &.is-error input {
          background-color: #ffebeb !important;
        }

        .el-input {
          input {
            padding-left: 34px;
            background: #F5F7FA;
            border: none;
            -webkit-appearance: none;
            border-radius: 0;
            color: $dark_gray;
            caret-color: $cursor;
            transition: box-shadow .2s, background-color .2s;

            &:-webkit-autofill {
              box-shadow: 0 0 0px 1000px #fff inset !important;
            }

            &:focus {
              box-shadow: 0 2px 0 0 #409eff;
            }
          }

          .el-input-group__append {
            border: none;

            &,
            button.el-button {
              border-radius: 0;
            }
          }
        }
      }

      .login-button {
        width: 100%;
        margin: 20px 0 0;

        i {
          margin-right: 10px;
        }
      }
    }
  }
}
</style>
