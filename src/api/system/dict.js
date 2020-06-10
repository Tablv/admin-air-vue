import request from '@/utils/request'

// 获取数据列表
export function getDataList(params) {
  return request.get('/system/dict/findDictAsync', params)
}

// 获取数据列表
export function getPreDataList(params) {
  return request.get('/system/dict/findDicts', params)
}

// 新增数据
export function doAddData(data) {
  return request.post('/system/dict/save', data, true)
}

// 获取数据列表
export function getDataInfo(params) {
  return request.get('/system/dict/findById', params)
}

// 编辑数据
export function doUpdateData(data) {
  return request.post('system/dict/update', data, true)
}

// 删除数据
export function doDeleteData(data) {
  return request.post('/system/dict/remove', data, true)
}
