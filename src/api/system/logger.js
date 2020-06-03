import request from '@/utils/request'

// 获取用户列表
export function getLogList(params) {
  return request.get('plugin/logger/list', params)
}

// 新增用户
export function doDeleteAll(data) {
  return request.post('/plugin/logger/clearAll', data, true)
}
