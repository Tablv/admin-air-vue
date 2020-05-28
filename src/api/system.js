import request from '@/utils/request'

// 获取用户管理列表
export function getUserList(params) {
  return request.get('/system/user/list', params)
}
