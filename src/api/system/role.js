import request from '@/utils/request'

// 获取角色列表
export function getRoleList(params) {
  return request.get('/system/role/list', params)
}

// 新增角色
export function doAddRole(data) {
  return request.post('/system/role/add', data, true)
}

// 获取角色信息
export function getRoleInfo(params) {
  return request.get('/system/role/findone', params)
}

// 编辑角色
export function doEditRole(data) {
  return request.post('/system/role/update', data, true)
}

// 删除角色
export function doDeleteRole(data) {
  return request.post('/system/role/delete', data, true)
}

// 分配用户-左侧未绑定用户
export function getUnBindUser(params) {
  return request.get('/system/role/listUserUnBind', params)
}

// 分配用户-右侧已绑定用户
export function getBindedUser(params) {
  return request.get('/system/role/listUserBinded', params)
}

// 分配用户-绑定用户
// 分配用户-解绑用户
