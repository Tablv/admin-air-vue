import request from '@/utils/request'
import qs from 'qs'

export function login(data) {
  return request({
    url: '/admin/doLogin',
    method: 'post',
    data: qs.stringify(data),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  })


  // return new Promise(resolve => {

  //   resolve({
  //     data: {
  //       code: 20000,
  //       token: "admin-token"
  //     }
  //   })
  // })
}

export function getInfo(token) {
  // return request({
  //   url: '/user/info',
  //   method: 'get',
  //   params: { token }
  // })
  return new Promise(resolve => {
    resolve({
      code: 20000,
      data: {
        roles: ['admin'],
        introduction: 'I am a super administrator',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: 'Super Admin'
      }
    })
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
