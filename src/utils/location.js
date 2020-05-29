// 本地存储 sessionStorage
const sessionStorage = window.sessionStorage
export const session = {
  /**
   * 设置session
   * @param {string} key 键
   * @param {*} value 值
   */
  setItem: function(key, value) {
    if (typeof value === 'object') {
      value = JSON.stringify(value)
    }
    sessionStorage.setItem(key, value)
  },

  /**
   * 获取session
   * @param {string} key 键
   */
  getItem: function(key) {
    return sessionStorage.getItem(key)
  },

  /**
   * 移除session
   * @param {string} key 键
   */
  remove: function(key) {
    if (sessionStorage.getItem(key)) {
      sessionStorage.removeItem(key)
    }
  },

  /**
   * 清空session
   */
  clear: function() {
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
  setItem: function(key, value) {
    if (typeof value === 'object') {
      value = JSON.stringify(value)
    }
    localStorage.setItem(key, value)
  },

  /**
   * 获取local
   * @param {string} key 键
   */
  getItem: function(key) {
    return localStorage.getItem(key)
  },

  /**
   * 移除local
   * @param {string} key 键
   */
  removeItem: function(key) {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key)
    }
  },

  /**
   * 清空local
   */
  clear: function() {
    localStorage.clear()
  }
}

