import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    hidden: true,
    redirect: '/index',
    children: [{
      path: 'index',
      name: 'Index',
      component: () => import('@/views/index'),
      meta: { title: '首页', icon: 'form', affix: true }
    }]
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  }
]

export const asyncRoutes = [
  {
    path: '/system',
    name: 'SYS',
    component: Layout,
    redirect: 'noRedirect',
    meta: { title: '系统管理', icon: 'desktop' },
    alwaysShow: true,
    children: [
      {
        path: 'user',
        name: 'SYS_USER',
        component: () => import('@/views/system/user/index'),
        meta: { title: '用户管理', icon: 'user' }
      },
      {
        path: 'menu',
        name: 'SYS_MENU',
        component: () => import('@/views/system/menu/index'),
        meta: { title: '菜单管理', icon: 'bars' }
      },
      {
        path: 'role',
        name: 'SYS_ROLE',
        component: () => import('@/views/system/role/index'),
        meta: { title: '角色管理', icon: 'address-card' }
      },
      {
        path: 'logger',
        name: 'SYS_LOG',
        component: () => import('@/views/system/logger/index'),
        meta: { title: '日志管理', icon: 'book' }
      },
      {
        path: 'terminal',
        name: 'SYS_TERMINAL',
        component: () => import('@/views/system/terminal/index'),
        meta: { title: '终端管理', icon: 'sitemap' }
      },
      {
        path: 'dept',
        name: 'SYS_DEPT',
        component: () => import('@/views/system/dept/index'),
        meta: { title: '组织管理', icon: 'building' }
      },
      {
        path: 'resource',
        name: 'SYSTEM_RESOURCE',
        component: () => import('@/views/system/resource/index'),
        meta: { title: '资源管理', icon: 'coins' }
      },
      {
        path: 'dict',
        name: 'DICT',
        component: () => import('@/views/system/dict/index'),
        meta: { title: '数据维护', icon: 'database' }
      },
      {
        path: 'di2ct',
        name: 'DI2CT',
        component: () => import('@/views/system/dict/index'),
        meta: { title: '数据2维护' }
      }
    ]
  }
]

const createRouter = () => new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

router.selfaddRoutes = (params) => {
  router.matcher = new Router().matcher
  router.addRoutes(params)
}

export default router
