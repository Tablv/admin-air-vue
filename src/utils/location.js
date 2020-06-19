// 本地存储 sessionStorage
const sessionStorage = window.sessionStorage
export const session = {
  /**
   * 设置session
   * @param {string} key 键
   * @param {*} value 值
   */
  setItem(key, value) {
    if (typeof value === 'object') {
      value = JSON.stringify(value)
    }
    sessionStorage.setItem(key, value)
  },

  /**
   * 获取session
   * @param {string} key 键
   */
  getItem(key) {
    return sessionStorage.getItem(key)
  },

  /**
   * 移除session
   * @param {string} key 键
   */
  remove(key) {
    if (sessionStorage.getItem(key)) {
      sessionStorage.removeItem(key)
    }
  },

  /**
   * 清空session
   */
  clear() {
    sessionStorage.clear()
  }
}

// 本地存储 localStorage
const localStorage = window.localStorage
export const local = {
  /**
   * 设置local
   * @param {string} key 键
   * @param {*} value 值
   */
  setItem(key, value) {
    if (typeof value === 'object') {
      value = JSON.stringify(value)
    }
    localStorage.setItem(key, value)
  },

  /**
   * 获取local
   * @param {string} key 键
   */
  getItem(key) {
    return localStorage.getItem(key)
  },

  /**
   * 移除local
   * @param {string} key 键
   */
  removeItem(key) {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key)
    }
  },

  /**
   * 清空local
   */
  clear() {
    localStorage.clear()
  }
}

