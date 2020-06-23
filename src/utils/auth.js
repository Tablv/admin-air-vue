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

export function handleRoute(backendRoutes, asyncRoutes) {
  const routeMap = backendRoutes.map(menu => menu.path);
  return filterRoute(asyncRoutes, routeMap)
}

function filterRoute(sourceRoutes = [], routeMap = [], basePath = "") {
  return sourceRoutes.filter(sourceRoute => {
    // 路径匹配
    const relativePath = sourceRoute.path;
    const fullPath = relativePath.startsWith("/") ? relativePath : basePath + "/" + relativePath;
    const matchPath = routeMap.includes(fullPath);
    
    // 过滤子路由
    if (sourceRoute?.children?.length) {
      sourceRoute.children = filterRoute(sourceRoute.children, routeMap, basePath + fullPath);
    }

    // 包含子路由
    const hasChildRoutes = !!(sourceRoute?.children?.length);

    return matchPath || hasChildRoutes;
  });
}
