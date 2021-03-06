import request from '@/utils/request'

// 查询所有终端数据
export function getAllTerminal(params) {
  return request.get('/system/terminal/findAll', params)
}

// 获取菜单列表
export function getMenuList(params) {
  return request.get('/system/menu/findMenusAsync', params)
}

// 获取上级菜单
export function getPreMenuList(params) {
  return request.get('/system/menu/findMenus', params)
}
// 获取菜单图标
export function getIconList(params) {
  return request.get('/static/icons/iconfont.json', params)
}

// 新增菜单
export function doAddMenu(data) {
  return request.post('/system/menu/save', data, true)
}

// 删除菜单
export function doDeleteMenu(data) {
  return request.post('/system/menu/remove', data, true)
}

// 查询菜单信息
export function getMenuInfo(params) {
  return request.get('/system/menu/selectone', params)
}

// 编辑菜单
export function doEditMenu(data) {
  return request.post('/system/menu/update', data, true)
}
