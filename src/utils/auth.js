import Cookies from 'js-cookie'

const TokenKey = 'accessToken'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function handleRoute(routeList, asyncRoutes) {
  const routeObj = handleRecursion(routeList)
  return filterRoute(asyncRoutes, Object.keys(routeObj))
}

function filterRoute(asyncRoutes = [], codeArray = []) {
  asyncRoutes.forEach((item, index, arr) => {
    if (codeArray.includes(item.name)) {
      if (item.children) {
        filterRoute(item.children, codeArray)
        if (!item.children.length) {
          arr.splice(index, 1)
        }
      }
    } else {
      arr.splice(index, 1)
    }
  })
  return asyncRoutes
}

function handleRecursion(routeList = [], result = {}) {
  routeList.forEach(item => {
    const children = item.children
    delete item.children
    result[item.code] = item
    if (children) {
      handleRecursion(children, result)
    }
  })
  return result
}
