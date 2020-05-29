import { session } from '@/utils/location'
import { login, logout, loadMenu } from '@/api/user'
import { getToken, setToken, removeToken, handleRoute } from '@/utils/auth'
import { resetRouter, asyncRoutes, constantRoutes } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    routerList: []
  }
}

const state = getDefaultState()

const getter = {
  getRouterList(state) {
    return state.routerList
  }
}

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROUTER: (state, routerList) => {
    state.routerList = routerList
  }
}

const actions = {
  /**
   * 用户登录
   */
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const token = response.result
        commit('SET_TOKEN', token)
        setToken(token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  /**
   * 获取用户信息
   */
  getInfo({ commit }, appkey) {
    return new Promise((resolve, reject) => {
      loadMenu(appkey).then(response => {
        const { result } = response
        const routerList = handleRoute(result, asyncRoutes).concat(constantRoutes)
        commit('SET_ROUTER', routerList)
        session.setItem('route', routerList)
        resolve(routerList)
      }).catch(error => {
        reject(error)
      })
    })
  },

  /**
   * 注销登录
   */
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        removeToken()
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  /**
   * 移除token
   */
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getter
}

