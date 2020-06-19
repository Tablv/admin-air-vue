import request from '@/utils/request'

// 获取日志列表
export function getLogList(params) {
  return request.get('plugin/logger/list', params)
}

// 清空日志
export function doDeleteAll(data) {
  return request.post('/plugin/logger/clearAll', data, true)
}
