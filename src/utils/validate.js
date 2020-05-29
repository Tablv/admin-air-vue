/**
 * Created by PanJiaChen on 16/11/18.
 */
/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

export function validName(rule, value, callback) {
  if (value === '') {
    callback(new Error('该项为必填项'))
  } else if (!/^[\u4e00-\u9fa5a-zA-Z0-9]+$/.test(value)) {
    callback(new Error('只能输入中文,英文和数字'))
  } else {
    callback()
  }
}
