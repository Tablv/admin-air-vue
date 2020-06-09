import request from '@/utils/request'

// 获取全部终端
export function getTerminalList(params) {
  return request.get('/system/terminal/findAll', params)
}

// 获取菜单数据
export function getMenuList(params) {
  return request.get('/system/menu/findMenus', params)
}

// 获取表格数据
export function getTableList(params) {
  return request.get('/system/resource/findOfPage', params)
}

// 新增资源
export function doAddRes(data) {
  return request.post('/system/resource/add', data, true)
}

// 获取资源信息
export function getResInfo(params) {
  return request.get('/system/resource/findone', params)
}

// 编辑资源
export function doUpdateRes(data) {
  return request.post('/system/resource/update', data, true)
}

// 删除资源
export function doDeleteRes(data) {
  return request.post('/system/resource/delete', data, true)
}
