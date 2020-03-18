import request from '@/utils/request'

// 用户信息列表
export function userList(query) {
    return request({
        url: '/admin/system/user/list',
        method: 'get',
        params: query,

    })
}
// 新增用户信息
export function userListAdd(query) {
    return request({
        url: '/admin/system/user/add',
        method: 'post',
        params: query
    })
}
// 删除用户信息
export function deleteUser(query) {
    return request({
        url: '/admin/system/user/delete',
        method: 'post',
        params: query
    })
}
// 更新用户信息
export function update(query) {
    return request({
        url: '/admin/system/user/update',
        method: 'post',
        params: query
    })
}
// 重置用户密码
export function resetPwd(query) {
    return request({
        url: '/admin/system/user/resetPwd',
        method: 'post',
        params: query
    })
}