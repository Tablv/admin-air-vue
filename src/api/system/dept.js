import request from '@/utils/request'

// 获取组织列表
export function getDeptGroup(params) {
  return request.get('/system/dept/findDeptAsync', params)
}

// 新增组织
export function doAddDept(data) {
  return request.post('/system/dept/save', data, true)
}

// 删除组织
export function doDeleteDept(data) {
  return request.post('/system/dept/remove', data, true)
}

// 获取组织信息
export function getDeptInfo(params) {
  return request.get('/system/dept/selectone', params)
}

// 编辑组织
export function doEditDept(data) {
  return request.post('/system/dept/update', data, true)
}
