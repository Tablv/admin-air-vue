import request from '@/utils/request'

export function login(data) {
  return request.post('/doLogin', data, true)
}

export function getInfo(token) {
  return request.get('/vue-admin-template/user/info', token)
}

export function logout() {
  return request.post('/vue-admin-template/user/logout')
}
