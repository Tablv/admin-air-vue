import request from '@/utils/request'

// 获取用户列表
export function getUserList(params) {
  return request.get('/system/user/list', params)
}

// 获取弹窗角色下拉框
export function getRoleList(params) {
  return request.get('/system/role/listAll', params)
}

// 获取弹窗组织下拉框
export function getDeptList(params) {
  return request.get('/system/dept/findDept', params)
}

// 新增用户
export function doAddUser(data) {
  return request.post('/system/user/add', data, true)
}

// 删除用户
export function doDeleteUser(data) {
  return request.post('/system/user/delete', data, true)
}

// 编辑用户
export function doEditUser(data) {
  return request.post('/system/user/update', data, true)
}

// 查询用户信息
export function doGetUserInfo(params) {
  return request.get('system/user/findone', params)
}

// 重置密码
export function doResetPwd(data) {
  return request.post('/system/user/resetPwd', data, true)
}

// 后台校验表单重复字段
export function doCheckRepeat(data) {
  return request.post('/common/exist', data, true)
}
