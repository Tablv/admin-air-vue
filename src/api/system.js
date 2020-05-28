import request from '@/utils/request'

// 用户管理---获取列表
export function getUserList(params) {
  return request.get('/system/user/list', params)
}

// 用户管理---获取弹窗角色下拉框
export function getRoleList(params) {
  return request.get('/system/role/listAll', params)
}

// 用户管理---获取弹窗组织下拉框
export function getDeptList(params) {
  return request.get('/system/dept/findDept', params)
}

// 用户管理---新增保存
export function doAddUser(data) {
  return request.post('/system/user/add', data, true)
}

// 用户管理---获取用户信息
export function doGetUserInfo(params) {
  return request.get('system/user/findone', params)
}

// 用户管理---编辑保存
export function doEditUser(data) {
  return request.post('/system/user/add', data, true)
}

// 用户管理---重置密码
export function doResetPwd(data) {
  return request.post('/system/user/resetPwd', data, true)
}

// 用户管理---删除用户
export function doDeleteUser(data) {
  return request.post('/system/user/delete', data, true)
}
