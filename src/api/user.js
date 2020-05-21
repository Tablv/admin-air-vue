import request from '@/utils/request'

export function login(data) {
  return request.post('/doLogin', data, true)
}

export function getInfo(token) {
  return request.get('/userinfo', token, false)
}

export function logout() {
  return request('logout')
}
