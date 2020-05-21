import request from '@/utils/request'

// 获取用户管理列表
export function getUserList(params) {
  return request({
    url: '/system/user/list',
    method: 'get',
    params: params
  })
}
