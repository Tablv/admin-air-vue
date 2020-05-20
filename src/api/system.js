import request from '@/utils/request'

export function getUserList(data) {
  return request.get(
    '/system/user/list',
    // data
    {
      r: Math.random(),
      order: 'asc',
      offset: 0,
      limit: 10,
      _: 1589939099167
    },
    false
  )
}
