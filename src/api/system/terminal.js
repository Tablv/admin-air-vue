import request from '@/utils/request'

// 获取终端列表
export function getTerminalList(params) {
  return request.get('/system/terminal/list', params)
}

// 新增终端
export function doAddTerminal(data) {
  return request.post('/system/terminal/add', data, true)
}

// 获取终端信息
export function getTerminalInfo(params) {
  return request.get('/system/terminal/findone', params)
}

// 编辑终端
export function doEditTerminal(data) {
  return request.post('/system/terminal/update', data, true)
}

// 删除终端
export function doDeleteTerminal(data) {
  return request.post('/system/terminal/delete', data, true)
}

