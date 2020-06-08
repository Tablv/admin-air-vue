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
export function doBindUser(data) {
  return request.post('/system/role/bindUser', data, true)
}

// 分配用户-解绑用户
export function doUnBindUser(data) {
  return request.post('/system/role/unBindUser', data, true)
}

// 分配用户-左侧全部部门
export function getAllDept(params) {
  return request.get('/system/dept/findDept', params)
}

// 分配用户-左侧未绑定部门
export function getUnBindDept(params) {
  return request.get('/system/role/listDeptUnBinded', params)
}

// 分配用户-右侧已绑定部门
export function getBindedDept(params) {
  return request.get('/system/role/listDeptBinded', params)
}

// 分配用户-绑定部门
export function doBindDept(data) {
  return request.post('/system/role/bindDept', data, true)
}

// 分配用户-解绑部门
export function doUnBindDept(data) {
  return request.post('/system/role/unBindDept', data, true)
}

// 分配菜单-获取全部终端
export function getTerminalList(params) {
  return request.get('/system/terminal/findAll', params)
}

// 分配菜单-获取菜单
export function getMenuList(params) {
  return request.get('/system/role/findMenusOfChecked', params)
}

// 分配菜单-绑定菜单
export function doBindMenu(data) {
  return request.post('/system/role/bindMenu', data, true)
}

