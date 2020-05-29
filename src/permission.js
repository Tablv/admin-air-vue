import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import 'nprogress/nprogress.css' // progress bar style

// NProgress Configuration
NProgress.configure({ showSpinner: false })

router.beforeEach(async(to, from, next) => {
  // 进度条开始
  NProgress.start()

  // 设置页面标题
  document.title = getPageTitle(to.meta.title)

  // 获取cookie中的token
  const hasToken = getToken()

  // 存在token
  if (hasToken) {
    // 如果是登录 直接重定向到首页
    if (to.path === '/login') {
      next({ path: '/index' })
      NProgress.done()
    } else {
      if (store.state.user.routerList.length) {
        return next()
      } else {
        try {
          store.dispatch('user/getInfo', { appKey: 'ynRhty3N' }).then(
            routerList => {
              router.addRoutes(routerList)
              router.options.routes = routerList
              // router.addRoutes([{ path: '*', redirect: '/404', hidden: true }])
              next({ path: '/index' })
              // next(to)
            }
          )
        } catch (error) {
          await store.dispatch('user/resetToken')
          next({
            path: '/login'
          })
          NProgress.done()
        }
      }
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
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
