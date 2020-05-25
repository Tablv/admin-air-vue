import router from './router'
// import store from './store'
// import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

router.beforeEach(async(to, from, next) => {
  // 进度条开始
  NProgress.start()

  // 设置页面标题
  document.title = getPageTitle(to.meta.title)

  // 获取cookie中的token
  const hasToken = getToken()

  // 存在token
  if (hasToken) {
    console.log(to.path );

    // 如果是登录 直接重定向到首页
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      next()
      // 用户信息
      // const hasGetUserInfo = store.getters.name
      // if (hasGetUserInfo) {
      //   next()
      // } else {
      //   // 不存在用户信息，尝试去获取，不然就重新登录
      //   try {
      //     // get user info
      //     await store.dispatch('user/getInfo')

      //     next()
      //   } catch (error) {
      //     // remove token and go to login page to re-login
      //     await store.dispatch('user/resetToken')
      //     Message.error(error || 'Has Error')
      //     next(`/login?redirect=${to.path}`)
      //     NProgress.done()
      //   }
      // }
    }
  } else {
    /* 没有token */
    // 如果是登录页
    if (to.path === '/login') {
      next()
    } else {
      // 其他页面重定向到login
      next({
        path: '/login'
      })
      // next()
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
