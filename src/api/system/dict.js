import request from '@/utils/request'

// 获取数据列表
export function getDataList(params) {
  return request.get('/system/dict/findDictAsync', params)
}

// 删除数据
export function doDeleteData(data) {
  return request.post('/system/dict/remove', data, true)
}
