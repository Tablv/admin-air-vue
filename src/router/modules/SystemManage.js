/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const tableRouter = {
  path: '/systemManage',
  component: Layout,
  redirect: '/SystemManage/userManage',
  name: 'SystemManage',
  meta: {
    title: '系统管理',
    icon: 'system-manage'
  },
  children: [
    {
      path: 'userManage',
      component: () => import('@/views/system-manage/user-manage/index'),
      name: 'userManage',
      meta: { title: '用户管理', icon: 'user-manage' }
    },
    {
      path: 'menuManage',
      component: () => import('@/views/system-manage/menu-manage/index'),
      name: 'menuManage',
      meta: { title: '菜单管理', icon: 'menu-manage' }
    },
    {
      path: 'roleManage',
      component: () => import('@/views/system-manage/role-manage/index'),
      name: 'roleManage',
      meta: { title: '角色管理', icon: 'role-manage' }
    }
  ]
}
export default tableRouter
