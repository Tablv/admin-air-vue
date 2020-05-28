import axios from 'axios'
// MessageBox
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import qs from 'qs'

// create an axios instance
const baseURL = process.env.VUE_APP_BASE_API

const axiosConfig = {
  // url = base url + request url
  baseURL,
  timeout: 5000
}
const service = axios.create(axiosConfig)
// request interceptor
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['Authorization'] = getToken()
    }
    return config
  },
  error => {
    console.error(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const { data, status } = response
    if (status !== 200) {
      Message({
        message: '网络异常',
        type: 'error',
        duration: 5 * 1000
      })
      // return MessageBox.confirm('网络异常', '提示', {
      //   confirmButtonText: 'Re-Login',
      //   cancelButtonText: 'Cancel',
      //   type: 'warning'
      // }).then(() => {
      //   store.dispatch('user/resetToken').then(() => {
      //     location.reload()
      //   })
      // })
      return Promise.reject(new Error('网络异常'))
    } else {
      return Promise.resolve(data)
    }
  },
  error => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

const request = {

  get: (url, params, isJson = false) => {
    const config = {
      method: 'GET',
      url,
      params: isJson ? qs.stringify(params) : params
    }
    return service(config)
  },

  post: (url, data, isJson = false) => {
    const config = {
      method: 'POST',
      url,
      data: isJson ? qs.stringify(data) : data
    }
    return service(config)
  },

  multipleRequest: (requests) => {
    const reqArray = []
    if (requests.length > 0) {
      for (const req of requests) {
        if (req.method === 'GET') {
          reqArray.push(service.get(baseURL + req.url, { params: req.data }))
        } else if (req.method === 'POST') {
          reqArray.push(service.post(baseURL + req.url, req.data))
        }
      }
      return service.all(reqArray)
    }
  }
}
export default request
